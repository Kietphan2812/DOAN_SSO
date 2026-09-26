const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Lỗi kết nối cơ sở dữ liệu SQLite:', err.message);
  } else {
    console.log('✓ Đã kết nối cơ sở dữ liệu SQLite tại:', dbPath);
  }
});

// Helper functions for Promises
const query = {
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  exec: (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

async function initDB() {
  // 1. Create tables
  await query.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      avatar TEXT DEFAULT '/uploads/default-avatar.png',
      role TEXT DEFAULT 'user',
      is_verified INTEGER DEFAULT 0,
      verification_token TEXT,
      verification_expires DATETIME,
      reset_token TEXT,
      reset_token_expires DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      image TEXT,
      sizes TEXT DEFAULT '["S","M","L","XL"]',
      colors TEXT DEFAULT '["Đen","Trắng","Be"]',
      stock INTEGER DEFAULT 100,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      category TEXT DEFAULT 'Xu hướng',
      summary TEXT,
      content TEXT NOT NULL,
      thumbnail TEXT,
      author_id INTEGER,
      author_name TEXT,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      payment_method TEXT DEFAULT 'cod',
      payment_status TEXT DEFAULT 'pending',
      order_status TEXT DEFAULT 'pending',
      total_amount REAL NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      size TEXT,
      color TEXT,
      image TEXT,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
    );
  `);

  console.log('✓ Các bảng cơ sở dữ liệu đã sẵn sàng.');

  // 2. Seed initial categories
  const catCount = await query.get('SELECT COUNT(*) as count FROM categories');
  if (catCount.count === 0) {
    const categories = [
      { name: 'Áo Nam & Nữ', slug: 'ao-thoi-trang', description: 'Áo thun, sơ mi, polo cao cấp trẻ trung', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80' },
      { name: 'Quần & Jeans', slug: 'quan-jeans', description: 'Quần tây, quần jean, kaki form chuẩn', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80' },
      { name: 'Áo Khoác & Blazer', slug: 'ao-khoac', description: 'Áo khoác gió, cardigan, blazer thanh lịch', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' },
      { name: 'Váy & Đầm Nữ', slug: 'vay-dam', description: 'Đầm xòe, váy dạo phố, trang nhã phong cách', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80' },
      { name: 'Phụ Kiện Thời Trang', slug: 'phu-kien', description: 'Mũ, thắt lưng, túi xách, khăn quàng phong cách', image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=600&q=80' }
    ];

    for (const cat of categories) {
      await query.run(
        'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
        [cat.name, cat.slug, cat.description, cat.image]
      );
    }
    console.log('✓ Đã khởi tạo danh mục mẫu.');
  }

  // 3. Seed initial users (Admin & demo customer)
  const userCount = await query.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    const adminPass = await bcrypt.hash('Admin@123', 10);
    const userPass = await bcrypt.hash('User@123', 10);

    await query.run(`
      INSERT INTO users (name, email, password, phone, address, role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, ['Quản Trị Viên (Admin)', 'admin@fashionhub.vn', adminPass, '0988888888', 'Hà Nội, Việt Nam', 'admin']);

    await query.run(`
      INSERT INTO users (name, email, password, phone, address, role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, ['Nguyễn Văn Khách', 'khachhang@fashionhub.vn', userPass, '0912345678', 'TP. Hồ Chí Minh', 'user']);

    console.log('✓ Đã khởi tạo tài khoản mẫu: admin@fashionhub.vn / Admin@123 & khachhang@fashionhub.vn / User@123');
  }

  // 4. Seed initial products
  const prodCount = await query.get('SELECT COUNT(*) as count FROM products');
  if (prodCount.count === 0) {
    const products = [
      {
        name: 'Áo Thun Unisex Cotton Basic Form Rộng',
        slug: 'ao-thun-unisex-cotton-basic',
        category_id: 1,
        price: 199000,
        original_price: 250000,
        description: 'Chất liệu 100% cotton 2 chiều co giãn tốt, thoáng mát, thấm hút mồ hôi. Thiết kế tối giản, dễ dàng mix & match nhiều phong cách năng động.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        colors: JSON.stringify(['Trắng', 'Đen', 'Xám', 'Xanh Rêu']),
        stock: 120,
        is_featured: 1
      },
      {
        name: 'Áo Sơ Mi Lụa Hàn Quốc Cổ Vest Thanh Lịch',
        slug: 'ao-so-mi-lua-han-quoc',
        category_id: 1,
        price: 349000,
        original_price: 420000,
        description: 'Vải lụa Hàn mềm mịn, chống nhăn, thoáng mát. Dáng áo suông vừa vặn tôn dáng công sở và dạo phố.',
        image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
        sizes: JSON.stringify(['M', 'L', 'XL']),
        colors: JSON.stringify(['Trắng', 'Xanh Pastel', 'Be']),
        stock: 75,
        is_featured: 1
      },
      {
        name: 'Quần Jean Ống Suông Vintage Denim Cao Cấp',
        slug: 'quan-jean-ong-suong-vintage',
        category_id: 2,
        price: 450000,
        original_price: 590000,
        description: 'Chất liệu denim dày dặn không bai dão, wash màu vintage phong cách retro. Phù hợp cả nam và nữ.',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
        sizes: JSON.stringify(['28', '29', '30', '31', '32']),
        colors: JSON.stringify(['Xanh Nhạt', 'Xanh Đậm', 'Đen']),
        stock: 60,
        is_featured: 1
      },
      {
        name: 'Quần Tây Baggy Công Sở Xếp Ly Hiện Đại',
        slug: 'quan-tay-baggy-cong-so',
        category_id: 2,
        price: 380000,
        original_price: 480000,
        description: 'Vải tuyết mưa đứng form, co giãn nhẹ. Cạp cao tôn chiều cao và tạo vẻ ngoài lịch sự, chỉn chu.',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        colors: JSON.stringify(['Đen', 'Ghi Đậm', 'Nâu Tây']),
        stock: 80,
        is_featured: 0
      },
      {
        name: 'Áo Khoác Bomber Kaki 2 Lớp Chống Gió',
        slug: 'ao-khoac-bomber-kaki-2-lop',
        category_id: 3,
        price: 520000,
        original_price: 650000,
        description: 'Chất kaki dù cao cấp chống thấm nhẹ, lớp lót dù giữ ấm tốt. Thiết kế bo chun cổ tay phong cách trẻ trung.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
        sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
        colors: JSON.stringify(['Đen', 'Rêu', 'Be']),
        stock: 50,
        is_featured: 1
      },
      {
        name: 'Áo Blazer Nữ Form Rộng Phong Cách Minimalism',
        slug: 'ao-blazer-nu-form-rong',
        category_id: 3,
        price: 590000,
        original_price: 750000,
        description: 'Blazer dáng xuông oversize chuẩn style Hàn Quốc, đệm vai tinh tế giúp vóc dáng thon gọn sang trọng.',
        image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&q=80',
        sizes: JSON.stringify(['S', 'M', 'L']),
        colors: JSON.stringify(['Be Cát', 'Nâu Nhạt', 'Đen']),
        stock: 45,
        is_featured: 1
      },
      {
        name: 'Váy Đầm Xòe Hoa Nhí Dạo Phố Cổ Vuông',
        slug: 'vay-dam-xoe-hoa-nhi',
        category_id: 4,
        price: 420000,
        original_price: 520000,
        description: 'Chất voan lụa nhẹ nhàng bồng bềnh, họa tiết hoa nhí nữ tính tươi sáng. Tay bồng nhẹ che khuyết điểm.',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
        sizes: JSON.stringify(['S', 'M', 'L']),
        colors: JSON.stringify(['Vàng Nhạt', 'Xanh Baby', 'Trắng Hoa']),
        stock: 40,
        is_featured: 1
      },
      {
        name: 'Mũ Bucket Vành Tròn Vải Canvas Thêu Nổi',
        slug: 'mu-bucket-canvas-theu-noi',
        category_id: 5,
        price: 150000,
        original_price: 200000,
        description: 'Chất liệu vải canvas 100% dày dặn, form nón chuẩn đẹp, che nắng hiệu quả cho các chuyến du lịch, dạo phố.',
        image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800&q=80',
        sizes: JSON.stringify(['Freesize']),
        colors: JSON.stringify(['Đen', 'Be Sữa', 'Cam Đất']),
        stock: 100,
        is_featured: 0
      }
    ];

    for (const p of products) {
      await query.run(`
        INSERT INTO products (category_id, name, slug, description, price, original_price, image, sizes, colors, stock, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [p.category_id, p.name, p.slug, p.description, p.price, p.original_price, p.image, p.sizes, p.colors, p.stock, p.is_featured]);
    }
    console.log('✓ Đã khởi tạo sản phẩm thời trang mẫu.');
  }

  // 5. Seed initial posts (Blog / Articles)
  const postCount = await query.get('SELECT COUNT(*) as count FROM posts');
  if (postCount.count === 0) {
    const admin = await query.get('SELECT id, name FROM users WHERE role = "admin" LIMIT 1');
    const posts = [
      {
        title: 'Top 7 Xu Hướng Phối Đồ Thu Đông 2026 Bạn Không Thể Bỏ Lỡ',
        slug: 'top-7-xu-huong-phoi-do-thu-dong-2026',
        category: 'Xu hướng thời trang',
        summary: 'Khám phá các phong cách phối đồ layer ấm áp nhưng vẫn chuẩn gu thanh lịch hiện đại cho mùa thu đông năm nay.',
        content: `Mùa thu đông luôn là thời điểm lý tưởng để các tín đồ thời trang thỏa sức sáng tạo với phong cách layering (nhiều lớp). Năm 2026 chứng kiến sự trở lại ngoạn mục của các tông màu đất ấm áp kết hợp cùng chất liệu dạ, len dệt kim và kaki cao cấp.

1. Phong cách Oversize Blazer kết hợp Quần Jean Vintage:
Một chiếc áo blazer vai rộng vừa vặn khi kết hợp với áo phông trắng cổ tròn và quần jean ống suông mang lại nét thanh lịch nhưng vô cùng năng động.

2. Phối đồ đơn sắc (Monochrome Styling):
Chọn cùng một tông màu như be, kem hoặc ghi xám từ đầu đến chân với các cấp độ sắc thái khác nhau sẽ tạo nên vẻ ngoài cực kỳ sang trọng và hack dáng tuyệt vời.

3. Điểm nhấn với phụ kiện tối giản:
Một chiếc thắt lưng da bản nhỏ cùng mũ bucket hoặc túi tote canvas sẽ là điểm kết nối hoàn hảo cho set đồ của bạn.`,
        thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
        views: 245
      },
      {
        title: 'Bí Quyết Chọn Size Quần Áo Chuẩn Form Khi Mua Hàng Online',
        slug: 'bi-quyet-chon-size-quan-ao-chuan-form-online',
        category: 'Mẹo thời trang',
        summary: 'Hướng dẫn đo thông số 3 vòng và cách so sánh bảng size chuẩn giúp bạn luôn chọn được trang phục vừa vặn hoàn hảo.',
        content: `Mua sắm thời trang trực tuyến ngày càng phổ biến, nhưng việc chọn đúng kích cỡ luôn là băn khoăn của nhiều bạn. Sau đây là những mẹo vàng giúp bạn an tâm đặt hàng:

1. Nắm rõ số đo cơ thể cơ bản:
Hãy dùng thước dây mềm để đo vòng ngực, vòng eo (vị trí nhỏ nhất trên rốn) và vòng mông. Đặc biệt đối với áo khoác và áo sơ mi, hãy lưu ý thêm số đo chiều rộng vai và chiều dài tay áo.

2. Hiểu rõ form dáng của trang phục:
- Slim-fit: Ôm sát đường cong cơ thể.
- Regular-fit: Form tiêu chuẩn, thoải mái vừa phải.
- Oversize / Loose-fit: Form rộng rãi, cá tính.

3. Đừng ngần ngại nhắn tin cho shop:
Bảng size mang tính chất tham khảo chung. Nếu số đo của bạn nằm ở khoảng giao giữa 2 size, hãy ưu tiên chọn size lớn hơn để dễ dàng vận động và chỉnh sửa nếu cần.`,
        thumbnail: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
        views: 189
      },
      {
        title: 'Hướng Dẫn Giữ Áo Thun Cotton Luôn Bền Màu Và Không Bị Gião Cổ',
        slug: 'huong-dan-giu-ao-thun-cotton-luon-ben-mau',
        category: 'Chăm sóc đồ',
        summary: 'Những nguyên tắc giặt và bảo quản áo thun cotton 100% giúp trang phục giữ được độ mới tinh tươm sau nhiều lần giặt.',
        content: `Áo thun cotton là món đồ không thể thiếu trong tủ đồ của bất kỳ ai, tuy nhiên nếu không biết cách chăm sóc, áo rất dễ bị bay màu hoặc bai dão cổ áo sau vài lần giặt.

1. Giặt đúng cách:
- Luôn lộn trái áo trước khi giặt để bảo vệ bề mặt vải và hình in.
- Sử dụng nước lạnh hoặc nước ấm dưới 30 độ C.
- Không nên dùng chất tẩy rửa mạnh hoặc đổ trực tiếp nước giặt lên bề mặt áo.

2. Phơi và treo áo thông minh:
- Tránh phơi trực tiếp dưới ánh nắng gắt buổi trưa.
- Nên luồn mắc áo từ dưới gấu áo lên để tránh làm giãn cổ áo.
- Vắt nhẹ tay, không vặn xoắn quá mạnh làm đứt gãy sợi cotton tự nhiên.`,
        thumbnail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
        views: 312
      }
    ];

    for (const post of posts) {
      await query.run(`
        INSERT INTO posts (title, slug, category, summary, content, thumbnail, author_id, author_name, views)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [post.title, post.slug, post.category, post.summary, post.content, post.thumbnail, admin ? admin.id : 1, admin ? admin.name : 'Ban Biên Tập', post.views]);
    }
    console.log('✓ Đã khởi tạo bài viết mẫu.');
  }
}

// Initialize tables on startup
initDB().catch(console.error);

module.exports = { db, query };

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('Products Routes (/api/products)', () => {
  let adminToken;
  let userToken;
  let createdProductId;

  beforeAll(() => {
    adminToken = jwt.sign(
      { id: 1, email: 'admin@fashionhub.vn', name: 'Admin Aura', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    userToken = jwt.sign(
      { id: 2, email: 'khachhang@fashionhub.vn', name: 'Khách hàng', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/products/categories/all', () => {
    it('lấy danh sách danh mục thành công', async () => {
      const res = await request(app).get('/api/products/categories/all');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.categories)).toBe(true);
    });
  });

  describe('GET /api/products', () => {
    it('lấy danh sách sản phẩm mặc định thành công', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(typeof res.body.total).toBe('number');
    });

    it('hỗ trợ tìm kiếm theo từ khóa (search)', async () => {
      const res = await request(app).get('/api/products?search=Áo');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
    });

    it('hỗ trợ lọc theo khoảng giá và sắp xếp', async () => {
      const res = await request(app).get('/api/products?minPrice=100000&maxPrice=900000&sort=price_asc');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
    });
  });

  describe('POST /api/products (Thêm sản phẩm mới)', () => {
    it('từ chối khi không có token (401)', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Áo Polo Test', price: 250000 });

      expect(res.statusCode).toBe(401);
    });

    it('từ chối khi người dùng không phải admin (403)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Áo Polo Test', price: 250000 });

      expect(res.statusCode).toBe(403);
    });

    it('trả về 400 nếu thiếu tên hoặc giá sản phẩm', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Chỉ có mô tả' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('bắt buộc');
    });

    it('cho phép Admin thêm sản phẩm mới thành công', async () => {
      const uniqueName = `Áo Thun Unit Test ${Date.now()}`;
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: uniqueName,
          category_id: 1,
          price: 299000,
          original_price: 399000,
          description: 'Sản phẩm thử nghiệm kiểm thử tự động',
          stock: 45,
          is_featured: 1
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.product).toHaveProperty('id');
      expect(res.body.product.name).toBe(uniqueName);

      createdProductId = res.body.product.id;
    });
  });

  describe('GET /api/products/:id (Chi tiết sản phẩm)', () => {
    it('lấy chi tiết sản phẩm hợp lệ thành công', async () => {
      const res = await request(app).get(`/api/products/${createdProductId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.id).toBe(createdProductId);
      expect(Array.isArray(res.body.related)).toBe(true);
    });

    it('trả về 404 cho sản phẩm không tồn tại', async () => {
      const res = await request(app).get('/api/products/99999999');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/products/:id (Cập nhật sản phẩm)', () => {
    it('cập nhật sản phẩm thành công với quyền Admin', async () => {
      const updatedName = 'Áo Thun Unit Test Đã Cập Nhật';
      const res = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: updatedName,
          price: 320000
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe(updatedName);
      expect(res.body.product.price).toBe(320000);
    });

    it('trả về 404 khi sửa sản phẩm không tồn tại', async () => {
      const res = await request(app)
        .put('/api/products/99999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Không tìm thấy' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/products/:id (Xóa sản phẩm)', () => {
    it('Admin xóa sản phẩm thành công', async () => {
      const res = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('thành công');
    });
  });
});

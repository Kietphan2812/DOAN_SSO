# BẢNG PHÂN CÔNG NHIỆM VỤ CHI TIẾT THEO TỪNG THÀNH VIÊN
### Đề tài: Xây dựng Website Thời trang AURA FASHION
### Môn học: Phát triển phần mềm mã nguồn mở (PTPMMNM) - Nhóm 4

---

## 👥 DANH SÁCH THÀNH VIÊN & VAI TRÒ GITHUB

| STT | Họ và Tên | Vai trò GitHub | Phân hệ phụ trách | Tên nhánh Git |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Phan Tấn Kiệt** | **Maintain kiêm Admin** | Khung dự án + Trang cá nhân (Profile) | `main` & `feature/user-profile` |
| **2** | **Nguyễn Thế Nhất** | **Write** | Xác thực, Đăng nhập, Đăng ký & Email OTP | `feature/auth-email` |
| **3** | **Dương Quốc Bảo** | **Write** | Giỏ hàng, Đặt hàng & Báo cáo Admin | `feature/cart-checkout-orders` |
| **4** | **Nguyễn Như Hồng Hạnh**| **Triage** | Bài viết thời trang (Blog CRUD & Tìm kiếm) | `feature/fashion-blog` |
| **5** | **Nguyễn Nữ Hồng Nhung** | **Triage** | Cửa hàng, Danh mục sản phẩm & Quick View | `feature/shop-catalog` |

---

## 📌 HƯỚNG DẪN CHI TIẾT FILE VÀ LỆNH GIT CHO TỪNG BẠN

### 1️⃣ Phan Tấn Kiệt (Maintain kiêm Admin - Trưởng nhóm)
- **Công việc:** 
  - Khởi tạo repo GitHub và đẩy khung sườn gốc lên nhánh `main`.
  - Duyệt và gộp (Merge) Pull Request của các thành viên.
  - Phụ trách phân hệ **Quản lý trang cá nhân (Profile)** & upload Avatar.
- **Các file phụ trách:**
  - `server/routes/user.js`
  - `server/middleware/upload.js`
  - `public/js/profile.js`
  - `public/css/profile.css`
- **Lệnh Git thực hiện:**
  ```bash
  git checkout -b feature/user-profile
  git add server/routes/user.js server/middleware/upload.js public/js/profile.js public/css/profile.css
  git commit -m "feat(profile): Phan Tan Kiet - Hoan thanh quan ly ho so ca nhan va avatar"
  git push -u origin feature/user-profile
  ```

---

### 2️⃣ Nguyễn Thế Nhất (Write - Developer)
- **Công việc:** Xây dựng hệ thống xác thực người dùng, bảo mật JWT Token, mã hóa mật khẩu và dịch vụ gửi mã OTP 6 số qua Email kích hoạt.
- **Các file phụ trách (tạo mới và code):**
  - `server/routes/auth.js`
  - `server/config/mailer.js`
  - `server/middleware/auth.js`
  - `public/js/auth.js`
  - `public/css/auth.css`
- **Lệnh Git thực hiện trên máy Thế Nhất:**
  ```bash
  git checkout -b feature/auth-email
  git add server/routes/auth.js server/config/mailer.js server/middleware/auth.js public/js/auth.js public/css/auth.css
  git commit -m "feat(auth): Nguyen The Nhat - He thong dang ky dang nhap va gui email OTP"
  git push -u origin feature/auth-email
  ```

---

### 3️⃣ Dương Quốc Bảo (Write - Developer)
- **Công việc:** Xây dựng luồng giỏ hàng, quy trình đặt hàng (COD / Chuyển khoản QR ngân hàng) và các chức năng quản lý đơn hàng của Admin.
- **Các file phụ trách (tạo mới và code):**
  - `server/routes/orders.js`
  - `server/routes/stats.js`
  - `public/js/admin.js`
  - `public/css/admin.css`
- **Lệnh Git thực hiện trên máy Quốc Bảo:**
  ```bash
  git checkout -b feature/cart-checkout-orders
  git add server/routes/orders.js server/routes/stats.js public/js/admin.js public/css/admin.css
  git commit -m "feat(orders): Duong Quoc Bao - Hoan thanh gio hang dat hang va quan tri admin"
  git push -u origin feature/cart-checkout-orders
  ```

---

### 4️⃣ Nguyễn Như Hồng Hạnh (Triage)
- **Công việc:** Xây dựng phân hệ tin tức thời trang Blog (thêm bài viết mới, đọc bài viết tự đếm lượt xem, tìm kiếm từ khóa theo thời gian thực, sửa/xóa bài viết).
- **Các file phụ trách (tạo mới và code):**
  - `server/routes/posts.js`
  - `public/js/blog.js`
  - `public/css/blog.css`
- **Lệnh Git thực hiện trên máy Hồng Hạnh:**
  ```bash
  git checkout -b feature/fashion-blog
  git add server/routes/posts.js public/js/blog.js public/css/blog.css
  git commit -m "feat(blog): Nguyen Nhu Hong Hanh - Quan ly bai viet thoi trang va tim kiem"
  git push -u origin feature/fashion-blog
  ```

---

### 5️⃣ Nguyễn Nữ Hồng Nhung (Triage)
- **Công việc:** Xây dựng trang danh mục sản phẩm thời trang (áo, quần, váy, blazer), lọc giá tăng/giảm, tìm kiếm và hộp thoại Xem Nhanh (Quick View) chọn Size S/M/L/XL và màu sắc.
- **Các file phụ trách (tạo mới và code):**
  - `server/routes/products.js`
  - `public/js/shop.js`
  - `public/css/shop.css`
- **Lệnh Git thực hiện trên máy Hồng Nhung:**
  ```bash
  git checkout -b feature/shop-catalog
  git add server/routes/products.js public/js/shop.js public/css/shop.css
  git commit -m "feat(shop): Nguyen Nu Hong Nhung - Danh muc san pham va hop thoai Quick View"
  git push -u origin feature/shop-catalog
  ```

---
© 2026 - **PTPMMNM - Nhóm 4**

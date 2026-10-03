# 📘 SỔ TAY GHI NHỚ TOÀN BỘ ĐỒ ÁN AURA FASHION - NHÓM 4 (PTPMMNM)

> **Tài liệu ghi nhớ vĩnh viễn (Persistent Memory Artifact)**  
> *Được khởi tạo lúc: 03/10/2026 - Dành cho Trưởng nhóm Phan Tấn Kiệt và các thành viên Nhóm 4.*

---

## 🏛️ 1. THÔNG TIN HỆ THỐNG VÀ KHO LƯU TRỮ (REPOSITORIES)

* **Tên đồ án:** AURA FASHION - Cửa hàng thời trang mã nguồn mở (Node.js + Express + SQLite + Vanilla JS + Jest/Supertest + GitHub Actions).
* **Kho lưu trữ chính của Nhóm (Upstream):**  
  `https://github.com/NHOM4-WEBDOAO/WEBDOAO_PTPMMNM_NHOM-4.git`  
  *(Được cấu hình làm remote `upstream` trên máy Kiệt).*
* **Kho lưu trữ cá nhân của Trưởng nhóm (Origin):**  
  `https://github.com/Kietphan2812/DOAN_SSO.git`  
  *(Được cấu hình làm remote `origin` trên máy Kiệt).*
* **Nhánh sao lưu toàn bộ code hoàn chỉnh (Safe Backup Branch):**  
  `backup/full-project-with-tests`  
  *(Đang được lưu trữ an toàn trên cả 2 kho GitHub. Nhánh này chứa toàn bộ code full tính năng và 76 bài test).*

---

## 🎯 2. HAI YÊU CẦU CỐT LÕI CỦA MÔN HỌC

1. **YÊU CẦU 1: Unit Test & Đo Coverage (Jest + Supertest)**
   - Cấu hình tại: `jest.config.js` và `package.json`.
   - Lệnh chạy: `npm test` hoặc `npm run test:coverage`.
   - Tiêu chí: Mọi module chức năng nộp lên phải có file kiểm thử tương ứng trong thư mục `tests/` với tỷ lệ bao phủ đạt chuẩn.

2. **YÊU CẦU 2: Kiểm duyệt tự động bằng CI/CD (GitHub Actions)**
   - Cấu hình tại: `.github/workflows/ci.yml`.
   - Cơ chế: Mỗi khi thành viên tạo **Pull Request (PR)** vào nhánh `main`, máy chủ Ubuntu của GitHub sẽ tự động khởi động (Node 20.x, 22.x), chạy `npm install` ➔ `npm run build` ➔ `npm run test:coverage`.
   - Kết quả: Đạt tiêu chuẩn thì hiện **TÍCH XANH `✓`**, có lỗi thì hiện **DẤU X ĐỎ `✗`**. Trưởng nhóm xem tích xanh mới bấm nút Merge PR.

---

## 👥 3. DANH SÁCH 5 THÀNH VIÊN VÀ PHÂN CÔNG NHIỆM VỤ

| STT | Thành viên | Vai trò | Chức năng phụ trách | File code phụ trách | File Unit Test phụ trách |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **0** | **Phan Tấn Kiệt** | Trưởng nhóm (Maintainer) | Khởi tạo khung sườn, cấu hình CI/CD, cơ sở dữ liệu SQLite, điều phối duyệt PR | • `server.js`<br>• `server/config/db.js`<br>• `public/index.html`<br>• `public/css/style.css`<br>• `public/js/app.js`<br>• `.github/workflows/ci.yml` | • `tests/health.test.js`<br>*(2 test cases - PASS 100%)* |
| **1** | **Nguyễn Thế Nhất** | Thành viên (Write) | Xác thực, Bảo mật Token JWT, Gửi Email OTP kích hoạt & Đổi mật khẩu | • `server/routes/auth.js`<br>• `server/config/mailer.js`<br>• `server/middleware/auth.js`<br>• `public/js/auth.js`<br>• `public/css/auth.css` | • `tests/auth.test.js`<br>• `tests/middleware.test.js`<br>*(26 test cases - PASS 100%)* |
| **2** | **Nguyễn Như Hồng Hạnh** | Thành viên (Triage/Read) | Bài viết thời trang, Tin tức & Blog, Tìm kiếm, Đăng bài | • `server/routes/posts.js`<br>• `public/js/blog.js`<br>• `public/css/blog.css` | • `tests/posts.test.js`<br>*(14 test cases - PASS 100%)* |
| **3** | **Dương Quốc Bảo** | Thành viên (Write/Triage) | Đơn hàng, Giỏ hàng, Thống kê doanh thu Dashboard Admin | • `server/routes/orders.js`<br>• `server/routes/stats.js`<br>• `public/js/admin.js`<br>• `public/css/admin.css` | • `tests/orders.test.js`<br>• `tests/stats.test.js`<br>*(11 test cases - PASS 100%)* |
| **4** | **Nguyễn Nữ Hồng Nhung** | Thành viên (Admin) | Quản lý sản phẩm thời trang, Phân loại danh mục, Lọc giá | • `server/routes/products.js`<br>• `public/js/shop.js`<br>• `public/css/shop.css` | • `tests/products.test.js`<br>*(13 test cases - PASS 100%)* |

---

## 📈 4. TIẾN ĐỘ THỰC TẾ HIỆN TẠI (CẬP NHẬT 03/10/2026)

* [x] **Khung sườn của Kiệt:** Đã hoàn chỉnh, `health.test.js` PASS, CI GitHub Actions xanh.
* [x] **Nguyễn Thế Nhất:** Đã hoàn thành và merge thành công `server/middleware/auth.js` và `tests/middleware.test.js` (10 tests PASS) vào `main`.
* [x] **Nguyễn Như Hồng Hạnh:** Đã hoàn thành và merge thành công `server/routes/posts.js` và `tests/posts.test.js` (14 tests PASS) vào `main`.
* [x] **Đồng bộ trên máy Kiệt:** Hiện tại `main` trên máy Kiệt đang chứa tổng cộng **26 bài test PASS 100%**.
* [ ] **Công việc kế tiếp:**
  - Nhất nộp tiếp phần routes auth & email: `auth.js`, `mailer.js`, `auth.test.js`, frontend.
  - Bảo nộp phần orders & admin stats.
  - Nhung nộp phần products & shop.

---

## 🛠️ 5. CẨM NANG CÁC LỆNH GIT THƯỜNG DÙNG

### 1. Đồng bộ code mới từ nhóm về máy:
```bash
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Xử lý khi bị lỗi xung đột hoặc đè file tạm:
```bash
git reset --hard
git merge upstream/main
```

### 3. Lấy lại file mẫu bất kỳ từ nhánh sao lưu:
```bash
git checkout backup/full-project-with-tests -- <duong_dan_file>
```

### 4. Kiểm tra Unit Test và Coverage:
```bash
# Chạy tất cả test
npm test

# Chạy test cụ thể kèm coverage
npx jest tests/posts.test.js --coverage
npx jest tests/middleware.test.js --coverage
```

# 🧪 THƯ MỤC KIỂM THỬ (UNIT TESTS)

Thư mục này chứa các bài kiểm thử tự động bằng Jest & Supertest của từng thành viên:

| STT | Thành viên | Tên file test cần thêm | Mục tiêu kiểm thử |
| :---: | :--- | :--- | :--- |
| **0** | *Khung sườn ban đầu* | `health.test.js` | *(Đã có sẵn)* Kiểm tra trạng thái máy chủ & SPA Fallback |
| **1** | **Nguyễn Thế Nhất** | `auth.test.js`<br>`middleware.test.js` | Kiểm thử Đăng ký, Đăng nhập, OTP, Đổi mật khẩu, JWT & Chặn quyền Admin (26 test cases) |
| **2** | **Dương Quốc Bảo** | `orders.test.js`<br>`stats.test.js` | Kiểm thử Đặt hàng, Tính tiền giỏ hàng, Doanh thu hệ thống (11 test cases) |
| **3** | **Nguyễn Như Hồng Hạnh** | `posts.test.js` | Kiểm thử Xem bài viết, Lọc danh mục, Tạo bài mới (14 test cases) |
| **4** | **Nguyễn Nữ Hồng Nhung** | `products.test.js` | Kiểm thử Lọc sản phẩm, Tìm kiếm, Thêm/Sửa/Xóa sản phẩm (13 test cases) |

---

### 🚀 Lệnh kiểm tra cục bộ trước khi tạo Pull Request:
```bash
# Chạy tất cả bài test
npm test

# Chạy test và đo độ bao phủ Coverage (> 70% là đạt chuẩn)
npm run test:coverage
```

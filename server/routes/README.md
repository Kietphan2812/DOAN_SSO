# 📂 THƯ MỤC CÁC TUYẾN ĐƯỜNG API (ROUTES)

Thư mục này chứa các file định tuyến API của Express.js do 4 thành viên tạo:

| STT | Thành viên phụ trách | Tên file cần tạo | Chức năng API |
| :---: | :--- | :--- | :--- |
| **1** | **Nguyễn Thế Nhất** | `auth.js` | Đăng ký tài khoản, Đăng nhập, Gửi OTP qua Nodemailer, Đổi mật khẩu |
| **2** | **Dương Quốc Bảo** | `orders.js`<br>`stats.js` | Đặt hàng, Xem lịch sử đơn hàng, Thống kê doanh thu admin |
| **3** | **Nguyễn Như Hồng Hạnh** | `posts.js` | Xem danh sách bài viết thời trang, Tìm kiếm, Đăng bài mới, Xem chi tiết |
| **4** | **Nguyễn Nữ Hồng Nhung** | `products.js` | Danh sách sản phẩm, Lọc theo danh mục, Tìm kiếm, Thêm/Sửa/Xóa sản phẩm |

---

### 📌 Lưu ý khi tạo file Route:
- Mỗi file route phải xuất module bằng `module.exports = router;`.
- Sau khi tạo file, mở file `server.js` ở thư mục gốc và bỏ dấu comment `//` ở dòng tương ứng để kích hoạt route.
- Lấy lại code hoàn chỉnh nhanh từ nhánh: `backup/full-project-with-tests`.

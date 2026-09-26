# BÁO CÁO PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
# ĐỀ TÀI: XÂY DỰNG WEBSITE BÁN QUẦN ÁO THỜI TRANG TRỰC TUYẾN
### Môn học: Phát triển phần mềm mã nguồn mở (PTPMMNM)
### Đơn vị thực hiện: Nhóm 4

---

## MỤC LỤC
1. [CHƯƠNG 1: TỔNG QUAN DỰ ÁN](#chương-1-tổng-quan-dự-án)
   - 1.1. Lý do chọn đề tài
   - 1.2. Mục tiêu dự án
   - 1.3. Phạm vi hệ thống
   - 1.4. Công nghệ mã nguồn mở áp dụng
2. [CHƯƠNG 2: PHÂN TÍCH YÊU CẦU HỆ THỐNG](#chương-2-phân-tích-yêu-cầu-hệ-thống)
   - 2.1. Yêu cầu chức năng (Functional Requirements)
   - 2.2. Yêu cầu phi chức năng (Non-Functional Requirements)
   - 2.3. Bảng tác nhân hệ thống (Actors)
   - 2.4. Ma trận phân quyền chức năng (RBAC)
3. [CHƯƠNG 3: MÔ HÌNH HÓA USE CASE & ĐẶC TẢ CHI TIẾT](#chương-3-mô-hình-hóa-use-case--đặc-tả-chi-tiết)
   - 3.1. Sơ đồ Use Case tổng quát
   - 3.2. Đặc tả Use Case Đăng ký & Xác thực Email
   - 3.3. Đặc tả Use Case Đăng nhập
   - 3.4. Đặc tả Use Case Quên mật khẩu & Tạo lại mật khẩu mới
   - 3.5. Đặc tả Use Case Quản lý bài viết thời trang (CRUD & Tìm kiếm)
   - 3.6. Đặc tả Use Case Quản lý trang cá nhân & Cập nhật thông tin
   - 3.7. Đặc tả Use Case Đặt hàng & Mua sắm
4. [CHƯƠNG 4: THIẾT KẾ CƠ SỞ DỮ LIỆU](#chương-4-thiết-kế-cơ-sở-dữ-liệu)
   - 4.1. Mô hình thực thể liên kết (ERD)
   - 4.2. Từ điển dữ liệu chi tiết các bảng (Data Dictionary)
5. [CHƯƠNG 5: THIẾT KẾ KIẾN TRÚC & SƠ ĐỒ TUẦN TỰ](#chương-5-thiết-kế-kiến-trúc--sơ-đồ-tuần-tự)
   - 5.1. Kiến trúc hệ thống Client - Server RESTful
   - 5.2. Sơ đồ luồng dữ liệu (DFD Mức 0 và Mức 1)
   - 5.3. Sơ đồ tuần tự (Sequence Diagrams)
6. [CHƯƠNG 6: THIẾT KẾ GIAO DIỆN NGƯỜI DÙNG (UI/UX)](#chương-6-thiết-kế-giao-diện-người-dùng-uiux)
   - 6.1. Nguyên lý thiết kế và trải nghiệm người dùng
   - 6.2. Thiết kế các phân hệ màn hình chính
7. [CHƯƠNG 7: HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH HỆ THỐNG](#chương-7-hướng-dẫn-cài-đặt--vận-hành-hệ-thống)
   - 7.1. Yêu cầu môi trường
   - 7.2. Các bước cài đặt và khởi chạy
   - 7.3. Danh sách tài khoản thử nghiệm

---

# CHƯƠNG 1: TỔNG QUAN DỰ ÁN

## 1.1. Lý do chọn đề tài
Trong kỷ nguyên số và thương mại điện tử bùng nổ, ngành thời trang là một trong những lĩnh vực có tốc độ tăng trưởng cao nhất. Khách hàng ngày càng có xu hướng mua sắm quần áo trực tuyến, tìm kiếm những bộ trang phục phù hợp với phong cách cá nhân, đồng thời cập nhật liên tục các xu hướng thời trang thông qua các bài viết cẩm nang, cẩm nang phối đồ (mix & match).

Việc ứng dụng các công nghệ mã nguồn mở (Open Source Software) như Node.js, Express, SQLite, chuẩn bảo mật JWT và Nodemailer vào việc xây dựng website bán quần áo không chỉ giúp tối ưu hóa chi phí đầu tư, mà còn mang lại tính linh hoạt cao, dễ mở rộng, nâng cấp và bảo mật.

## 1.2. Mục tiêu dự án
1. Xây dựng website bán quần áo trực tuyến hoàn chỉnh với tên thương hiệu **AURA FASHION**.
2. Đáp ứng đầy đủ các chức năng cốt lõi theo đề bài:
   - **Xác thực & Bảo mật:** Đăng ký tài khoản, gửi email xác nhận kích hoạt, đăng nhập, quên mật khẩu, tạo lại mật khẩu mới thông qua mã OTP bảo mật.
   - **Quản lý nội dung:** Tạo mới, xem chi tiết, tìm kiếm theo từ khóa/danh mục, cập nhật và xóa thông tin bài viết thời trang (Blog / News).
   - **Quản lý người dùng:** Quản lý trang cá nhân, cập nhật thông tin cá nhân (họ tên, SĐT, địa chỉ giao hàng), tải lên ảnh đại diện (Avatar), đổi mật khẩu.
   - **Thương mại điện tử:** Danh mục thời trang, bộ lọc sản phẩm, chi tiết sản phẩm chọn size/màu, giỏ hàng, quy trình đặt hàng và theo dõi đơn hàng.
   - **Quản trị hệ thống (Admin):** Thống kê doanh thu, quản lý sản phẩm, đơn hàng, bài viết.
3. Thiết kế giao diện hiện đại, thẩm mỹ cao (Wow factor), hỗ trợ chế độ Sáng / Tối (Light / Dark mode), responsive mượt mà trên cả thiết bị di động và máy tính.
4. Đóng gói mã nguồn sạch, cấu trúc chuẩn hóa, dễ dàng triển khai chỉ với một câu lệnh `npm start`.

## 1.3. Phạm vi hệ thống
- **Khách vãng lai (Guest):** Xem danh mục sản phẩm, tìm kiếm bài viết, xem chi tiết sản phẩm, đăng ký tài khoản, đăng nhập, đặt hàng nhanh.
- **Khách hàng đã đăng nhập (Member):** Nhận email xác nhận, quản lý trang cá nhân, xem lịch sử đơn mua, viết bài chia sẻ phong cách, sửa/xóa bài viết của chính mình.
- **Quản trị viên (Admin):** Quản lý toàn bộ danh mục sản phẩm, quản lý trạng thái các đơn hàng, duyệt và chỉnh sửa/xóa bất kỳ bài viết nào, theo dõi biểu đồ doanh thu và thống kê hệ thống.

## 1.4. Công nghệ mã nguồn mở áp dụng
- **Backend Runtime:** Node.js v24+
- **Web Framework:** Express.js (v5.x)
- **Cơ sở dữ liệu:** SQLite3 (Cơ sở dữ liệu quan hệ nhúng, phi tập trung, zero-configuration, lưu trữ dạng file độc lập `database.sqlite`).
- **Mã hóa & Xác thực:** `bcryptjs` (băm mật khẩu salt 10 rounds), `jsonwebtoken` (JSON Web Token - JWT).
- **Dịch vụ Email:** `nodemailer` (Hỗ trợ SMTP thực tế như Gmail/SendGrid kết hợp tài khoản kiểm thử Ethereal Mail tự động sinh link xem trước).
- **Upload File Đa phương tiện:** `multer` (Upload ảnh đại diện người dùng và hình ảnh bài viết vào thư mục `/public/uploads/`).
- **Frontend:** HTML5 ngữ nghĩa, Vanilla CSS theo Design System tokens tùy biến cao cấp (Google Fonts Plus Jakarta Sans, CSS Variables, Glassmorphism, Micro-animations), Vanilla JavaScript ES6+ Module.

---

# CHƯƠNG 2: PHÂN TÍCH YÊU CẦU HỆ THỐNG

## 2.1. Yêu cầu chức năng (Functional Requirements)
Hệ thống được chia thành 4 phân hệ chức năng chính:

### Phân hệ 1: Xác thực & Tài khoản (Authentication & Account)
- **FR1.1 - Đăng ký tài khoản:** Cho phép người dùng nhập họ tên, email, mật khẩu, số điện thoại, địa chỉ. Hệ thống kiểm tra trùng lặp email và lưu mật khẩu dạng mã hóa bcrypt.
- **FR1.2 - Gửi email xác nhận:** Sau khi đăng ký, hệ thống tự động tạo mã xác thực OTP 6 số và Token kích hoạt, gửi email kích hoạt tới địa chỉ người dùng.
- **FR1.3 - Kích hoạt tài khoản:** Người dùng nhập mã OTP trên website hoặc nhấp trực tiếp vào đường link trong email để kích hoạt trạng thái tài khoản `is_verified = 1`.
- **FR1.4 - Đăng nhập:** Kiểm tra email và mật khẩu, cấp phát JSON Web Token (JWT) có thời hạn 7 ngày lưu trữ tại client.
- **FR1.5 - Quên mật khẩu:** Người dùng nhập email đã đăng ký. Hệ thống tạo mã OTP đặt lại mật khẩu có thời hạn 15 phút và gửi email kèm liên kết an toàn.
- **FR1.6 - Tạo lại mật khẩu mới:** Người dùng nhập mã OTP/Token và mật khẩu mới để cập nhật mật khẩu vào cơ sở dữ liệu.

### Phân hệ 2: Quản lý bài viết thời trang (Blog / News Management)
- **FR2.1 - Xem danh sách bài viết:** Hiển thị bài viết dạng thẻ lưới (Card Grid) kèm hình ảnh thumbnail, tiêu đề, ngày đăng, chuyên mục, số lượt xem và tác giả.
- **FR2.2 - Xem chi tiết bài viết:** Hiển thị toàn văn bài viết, tự động tăng bộ đếm lượt xem (views counter), gợi ý bài viết liên quan cùng chuyên mục.
- **FR2.3 - Tìm kiếm & lọc bài viết:** Cho phép tìm kiếm bài viết theo từ khóa (tiêu đề, tóm tắt, nội dung) và lọc theo chủ đề (Xu hướng, Mẹo thời trang, Chăm sóc đồ...).
- **FR2.4 - Tạo bài viết mới:** Người dùng đã đăng nhập hoặc Admin có thể viết bài mới, tải lên ảnh thumbnail hoặc nhập URL ảnh.
- **FR2.5 - Cập nhật bài viết:** Tác giả bài viết hoặc Admin có quyền chỉnh sửa tiêu đề, danh mục, nội dung bài viết.
- **FR2.6 - Xóa bài viết:** Cho phép tác giả hoặc Admin xóa bài viết khỏi hệ thống (có hộp thoại xác nhận).

### Phân hệ 3: Quản lý trang cá nhân (Profile Management)
- **FR3.1 - Xem trang cá nhân:** Hiển thị ảnh đại diện, họ tên, email, trạng thái xác thực email, tổng số đơn hàng đã đặt, danh sách bài viết đã đăng.
- **FR3.2 - Cập nhật thông tin:** Cho phép chỉnh sửa họ tên, số điện thoại, địa chỉ giao hàng.
- **FR3.3 - Tải lên ảnh đại diện:** Upload file ảnh đại diện (PNG, JPG, WEBP) lưu trữ trực tiếp vào hệ thống.
- **FR3.4 - Đổi mật khẩu:** Yêu cầu nhập mật khẩu hiện tại, kiểm tra xác thực và đổi sang mật khẩu mới.
- **FR3.5 - Xem lịch sử đơn hàng:** Theo dõi mã đơn, ngày mua, trạng thái xử lý đơn hàng và tổng giá trị.

### Phân hệ 4: Bán hàng & Quản trị thương mại (E-Commerce & Admin)
- **FR4.1 - Danh mục & Sản phẩm:** Hiển thị danh sách sản phẩm thời trang theo danh mục (Áo, Quần, Áo khoác, Váy, Phụ kiện), tìm kiếm theo tên, sắp xếp theo giá và độ mới.
- **FR4.2 - Chi tiết sản phẩm:** Xem hình ảnh, chọn kích cỡ (S, M, L, XL), chọn màu sắc, điều chỉnh số lượng.
- **FR4.3 - Giỏ hàng (Cart):** Thêm sản phẩm, thay đổi số lượng, xóa sản phẩm, tự động tính tổng tiền.
- **FR4.4 - Đặt hàng & Thanh toán:** Nhập thông tin giao hàng, chọn phương thức COD (Tiền mặt) hoặc Chuyển khoản QR ngân hàng (VietQR).
- **FR4.5 - Dashboard Quản trị (Admin):** Thống kê doanh thu, tổng số đơn, sản phẩm, bài viết, người dùng. Quản lý trạng thái đơn hàng (Chờ xử lý, Đang giao, Hoàn tất, Hủy).

## 2.2. Yêu cầu phi chức năng (Non-Functional Requirements)
- **NFR1 - Hiệu năng:** Thời gian phản hồi API trung bình dưới 50ms nhờ SQLite tối ưu hóa truy vấn có index.
- **NFR2 - Tính khả dụng & Di động:** Giao diện Responsive chuẩn xác từ màn hình điện thoại 375px đến màn hình 4K.
- **NFR3 - Bảo mật:**
  - Mật khẩu người dùng được băm an toàn bằng thuật toán bcrypt (không bao giờ lưu mật khẩu dạng thô).
  - Xác thực phiên làm việc thông qua token JWT ký bí mật.
  - Chống tấn công SQL Injection bằng cơ chế chuẩn hóa Prepared Statement (tham số `?`).
  - Phân quyền chặt chẽ thông qua middleware `verifyToken` và `requireAdmin`.
- **NFR4 - Trải nghiệm người dùng (UX):** Thông báo Toast mượt mà, xác nhận xóa trực quan, hỗ trợ chế độ Dark Mode bảo vệ mắt khi duyệt web ban đêm.
- **NFR5 - Khả năng cài đặt & Độc lập:** Ứng dụng khép kín, không phụ thuộc máy chủ CSDL phức tạp bên ngoài.

## 2.3. Bảng tác nhân hệ thống (Actors)
| Tác nhân (Actor) | Mô tả vai trò |
| :--- | :--- |
| **Khách (Guest)** | Người dùng chưa đăng nhập, có thể duyệt xem sản phẩm, bài viết, tìm kiếm và tạo tài khoản. |
| **Khách hàng (User)** | Người dùng đã đăng ký và xác thực tài khoản. Có thể quản lý trang cá nhân, viết bài, đặt hàng và theo dõi đơn. |
| **Quản trị viên (Admin)** | Người có quyền hạn cao nhất trong hệ thống, quản lý người dùng, sản phẩm, toàn bộ bài viết, trạng thái đơn hàng và xem thống kê doanh thu. |

## 2.4. Ma trận phân quyền chức năng (RBAC Matrix)
| Chức năng | Khách (Guest) | Khách hàng (User) | Quản trị viên (Admin) |
| :--- | :---: | :---: | :---: |
| Xem sản phẩm & bài viết | ✓ | ✓ | ✓ |
| Tìm kiếm sản phẩm & bài viết | ✓ | ✓ | ✓ |
| Đăng ký & Kích hoạt Email | ✓ | - | - |
| Đăng nhập hệ thống | ✓ | - | - |
| Quên mật khẩu & Đặt lại mật khẩu | ✓ | ✓ | ✓ |
| Thêm vào giỏ & Đặt hàng | ✓ | ✓ | ✓ |
| Cập nhật thông tin cá nhân | ✗ | ✓ | ✓ |
| Đổi mật khẩu cá nhân | ✗ | ✓ | ✓ |
| Tải lên ảnh đại diện | ✗ | ✓ | ✓ |
| Tạo bài viết mới | ✗ | ✓ | ✓ |
| Sửa / Xóa bài viết của mình | ✗ | ✓ | ✓ |
| Sửa / Xóa bất kỳ bài viết nào | ✗ | ✗ | ✓ |
| Thêm / Sửa / Xóa sản phẩm | ✗ | ✗ | ✓ |
| Quản lý trạng thái đơn hàng | ✗ | ✗ | ✓ |
| Xem thống kê doanh thu hệ thống | ✗ | ✗ | ✓ |

---

# CHƯƠNG 3: MÔ HÌNH HÓA USE CASE & ĐẶC TẢ CHI TIẾT

## 3.1. Sơ đồ Use Case tổng quát
```
+--------------------------------------------------------------------------------+
|                        HỆ THỐNG WEBSITE AURA FASHION                           |
+--------------------------------------------------------------------------------+
                                       
             (Đăng ký tài khoản) <-----------------+
                      ^                            |
                      | <<include>>                |
             (Gửi email xác nhận)                  |
                      ^                            |
                      | <<extend>>                 |
             (Xác nhận qua mã OTP)                 |
                                                   |
             (Đăng nhập hệ thống) <----------------+
                                                   |
             (Quên mật khẩu & Đặt lại) <-----------+---- [ KHÁCH HÀNG (User) ]
                                                   |
             (Quản lý trang cá nhân) <-------------+
                |-- Cập nhật thông tin             |
                |-- Tải lên Avatar                 |
                |-- Đổi mật khẩu                   |
                \-- Xem đơn hàng                   |
                                                   |
             (Quản lý bài viết - CRUD) <-----------+
                |-- Xem & Tìm kiếm bài viết        |
                |-- Viết bài mới                   |
                |-- Cập nhật bài viết              |
                \-- Xóa bài viết                   |
                                                   |
             (Mua sắm & Đặt hàng) <----------------+
                                                   |
                                                   |
             (Quản trị hệ thống) <----------------------- [ QUẢN TRỊ VIÊN (Admin) ]
                |-- Thống kê doanh thu & báo cáo
                |-- Thêm, sửa, xóa sản phẩm
                |-- Cập nhật trạng thái đơn hàng
                \-- Kiểm duyệt mọi bài viết
```

## 3.2. Đặc tả Use Case chi tiết

### UC01: Đăng ký & Xác thực Email
- **Mã Use Case:** UC-AUTH-01
- **Tác nhân:** Khách vãng lai
- **Tiền điều kiện:** Người dùng chưa đăng nhập và email chưa tồn tại trong hệ thống.
- **Hậu điều kiện:** Tài khoản được tạo với trạng thái `is_verified = 0`, nhận email xác thực. Sau khi nhập đúng OTP, trạng thái chuyển thành `is_verified = 1`.
- **Luồng sự kiện chính (Main Flow):**
  1. Người dùng bấm nút "Đăng Ký" trên thanh điều hướng.
  2. Hệ thống hiển thị hộp thoại đăng ký.
  3. Người dùng nhập: Họ tên, Email, Mật khẩu, Số điện thoại, Địa chỉ.
  4. Hệ thống kiểm tra định dạng và tính duy nhất của email.
  5. Hệ thống băm mật khẩu bằng bcrypt, tạo mã OTP ngẫu nhiên 6 chữ số và Token ngẫu nhiên 32 bytes, lưu vào CSDL kèm thời hạn hiệu lực 24 giờ.
  6. Hệ thống gửi email HTML chứa mã OTP và link kích hoạt tới email người dùng qua Nodemailer.
  7. Hệ thống tự động chuyển sang hộp thoại "Xác Nhận Kích Hoạt Tài Khoản".
  8. Người dùng nhập mã OTP gồm 6 chữ số nhận được từ email và bấm xác nhận.
  9. Hệ thống kiểm tra mã, cập nhật `is_verified = 1`, cấp JWT token và tự động đăng nhập cho người dùng.
- **Luồng ngoại lệ (Alternative Flow):**
  - 4a. Email đã tồn tại: Hệ thống hiển thị cảnh báo "Email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác".
  - 8a. Nhập sai OTP hoặc OTP hết hạn: Hệ thống báo lỗi và cho phép bấm "Gửi lại mã xác nhận mới".

### UC02: Quên mật khẩu & Tạo lại mật khẩu mới
- **Mã Use Case:** UC-AUTH-02
- **Tác nhân:** Người dùng quên mật khẩu
- **Tiền điều kiện:** Tài khoản đã có sẵn trên hệ thống.
- **Hậu điều kiện:** Mật khẩu cũ được thay thế bằng mật khẩu mới đã băm.
- **Luồng sự kiện chính:**
  1. Người dùng chọn liên kết "Quên mật khẩu?" tại form đăng nhập.
  2. Hệ thống yêu cầu nhập địa chỉ email đã đăng ký.
  3. Hệ thống tạo mã OTP khôi phục 6 số và Token đặt lại mật khẩu với thời hạn 15 phút.
  4. Hệ thống gửi email chứa mã OTP và link khôi phục mật khẩu.
  5. Người dùng nhập mã OTP và mật khẩu mới (tối thiểu 6 ký tự).
  6. Hệ thống băm mật khẩu mới, cập nhật vào CSDL và xóa token khôi phục.
  7. Hệ thống thông báo thành công và chuyển người dùng về màn hình đăng nhập.

### UC03: Tạo, Xem, Tìm kiếm, Cập nhật, Xóa bài viết thời trang (CRUD)
- **Mã Use Case:** UC-POST-01
- **Tác nhân:** Khách hàng (User), Quản trị viên (Admin), Khách (Guest)
- **Luồng sự kiện:**
  1. **Xem & Tìm kiếm (Khách, User, Admin):** Người dùng vào mục "Bài Viết Thời Trang", hệ thống tải danh sách bài viết. Người dùng có thể nhập từ khóa vào ô tìm kiếm hoặc chọn chuyên mục để lọc kết quả theo thời gian thực. Bấm vào bài viết để mở giao diện đọc toàn màn hình và tăng lượt xem.
  2. **Tạo bài viết (User, Admin):** Người dùng bấm "Viết Bài Mới", nhập tiêu đề, danh mục, tóm tắt, nội dung và chọn ảnh đại diện (URL hoặc tải file ảnh từ máy). Bấm "Lưu Bài Viết", hệ thống lưu bài viết vào bảng `posts` và cập nhật danh sách ngay lập tức.
  3. **Cập nhật bài viết (Tác giả, Admin):** Người dùng bấm nút biểu tượng cây bút "Sửa", hệ thống tải lại toàn bộ nội dung bài viết vào form editor. Người dùng chỉnh sửa và bấm lưu, hệ thống cập nhật vào CSDL.
  4. **Xóa bài viết (Tác giả, Admin):** Người dùng bấm biểu tượng thùng rác "Xóa", hệ thống yêu cầu xác nhận. Nếu đồng ý, hệ thống gọi API `DELETE /api/posts/:id` để xóa bản ghi.

### UC04: Quản lý trang cá nhân & Cập nhật thông tin
- **Mã Use Case:** UC-USER-01
- **Tác nhân:** Khách hàng (User) đã đăng nhập
- **Luồng sự kiện:**
  1. Người dùng bấm vào menu người dùng -> Chọn "Trang Cá Nhân".
  2. Hệ thống tải dữ liệu tài khoản, ảnh đại diện, lịch sử đơn hàng và bài viết đã đăng.
  3. Người dùng cập nhật họ tên, SĐT, địa chỉ mặc định và bấm "Lưu Thay Đổi".
  4. Người dùng bấm vào biểu tượng camera trên avatar để chọn file ảnh mới. Hệ thống upload qua Multer và cập nhật ảnh đại diện trên toàn trang web.
  5. Người dùng chuyển sang tab "Đổi Mật Khẩu", nhập mật khẩu cũ và mật khẩu mới để đổi mật khẩu.

---

# CHƯƠNG 4: THIẾT KẾ CƠ SỞ DỮ LIỆU

Hệ thống sử dụng cơ sở dữ liệu quan hệ SQLite chuẩn mực với 6 bảng liên kết chặt chẽ.

## 4.1. Mô hình thực thể liên kết (ERD)
```
  +------------------+         1:N         +------------------+
  |    categories    |-------------------->|     products     |
  +------------------+                     +------------------+
  | id (PK)          |                     | id (PK)          |
  | name             |                     | category_id (FK) |
  | slug             |                     | name             |
  | description      |                     | price, stock     |
  | image            |                     | sizes, colors    |
  +------------------+                     +------------------+
                                                     |
                                                     | 1:N
                                                     v
  +------------------+         1:N         +------------------+
  |      users       |-------------------->|      orders      |
  +------------------+                     +------------------+
  | id (PK)          |                     | id (PK)          |
  | name, email      |                     | order_code       |
  | password (hash)  |                     | user_id (FK)     |
  | role             |                     | customer_name    |
  | is_verified      |                     | total_amount     |
  | verification_... |                     | order_status     |
  +------------------+                     +------------------+
        |        |                                   |
    1:N |        \-----------------\ 1:N             | 1:N
        v                          v                 v
  +------------------+   +------------------+  +------------------+
  |      posts       |   | (Password/Email) |  |   order_items    |
  +------------------+   |   Tokens fields  |  +------------------+
  | id (PK)          |   +------------------+  | id (PK)          |
  | author_id (FK)   |                         | order_id (FK)    |
  | title, slug      |                         | product_id (FK)  |
  | content, views   |                         | price, quantity  |
  | thumbnail        |                         | size, color      |
  +------------------+                         +------------------+
```

## 4.2. Từ điển dữ liệu chi tiết các bảng (Data Dictionary)

### Bảng 1: `users` (Người dùng)
Lưu trữ thông tin tài khoản, mật khẩu băm, quyền hạn và trạng thái xác thực email.
| Tên cột | Kiểu dữ liệu | Khóa | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | PK | AUTOINCREMENT | Mã định danh người dùng |
| `name` | TEXT | | NOT NULL | Họ và tên người dùng |
| `email` | TEXT | | UNIQUE, NOT NULL | Địa chỉ email đăng ký |
| `password` | TEXT | | NOT NULL | Mật khẩu băm (bcrypt salt 10) |
| `phone` | TEXT | | NULL | Số điện thoại |
| `address` | TEXT | | NULL | Địa chỉ giao hàng |
| `avatar` | TEXT | | DEFAULT 'default-avatar.png' | Đường dẫn ảnh đại diện |
| `role` | TEXT | | DEFAULT 'user' | Quyền: 'user' hoặc 'admin' |
| `is_verified` | INTEGER | | DEFAULT 0 | 0: Chưa kích hoạt, 1: Đã kích hoạt |
| `verification_token` | TEXT | | NULL | Chứa Token và mã OTP xác nhận |
| `verification_expires`| DATETIME| | NULL | Thời điểm hết hạn OTP xác thực |
| `reset_token` | TEXT | | NULL | Chứa Token và OTP đặt lại mật khẩu |
| `reset_token_expires` | DATETIME| | NULL | Thời điểm hết hạn OTP khôi phục |
| `created_at` | DATETIME | | DEFAULT CURRENT_TIMESTAMP | Ngày tạo tài khoản |
| `updated_at` | DATETIME | | DEFAULT CURRENT_TIMESTAMP | Ngày cập nhật |

### Bảng 2: `categories` (Danh mục thời trang)
| Tên cột | Kiểu dữ liệu | Khóa | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | PK | AUTOINCREMENT | Mã danh mục |
| `name` | TEXT | | NOT NULL | Tên danh mục (Áo, Quần, Blazer...) |
| `slug` | TEXT | | UNIQUE, NOT NULL | Chuỗi đường dẫn tĩnh |
| `description` | TEXT | | NULL | Mô tả danh mục |
| `image` | TEXT | | NULL | Ảnh tiêu biểu của danh mục |

### Bảng 3: `products` (Sản phẩm quần áo)
| Tên cột | Kiểu dữ liệu | Khóa | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | PK | AUTOINCREMENT | Mã sản phẩm |
| `category_id` | INTEGER | FK | REFERENCES categories(id) | Mã danh mục liên kết |
| `name` | TEXT | | NOT NULL | Tên sản phẩm |
| `slug` | TEXT | | UNIQUE | Đường dẫn tĩnh sản phẩm |
| `description` | TEXT | | NULL | Mô tả chi tiết chất liệu, phom dáng |
| `price` | REAL | | NOT NULL | Giá bán thực tế (VNĐ) |
| `original_price` | REAL | | NULL | Giá niêm yết ban đầu |
| `image` | TEXT | | NOT NULL | Đường dẫn ảnh sản phẩm |
| `sizes` | TEXT | | DEFAULT '["S","M","L","XL"]' | Chuỗi JSON các size có sẵn |
| `colors` | TEXT | | DEFAULT '["Đen","Trắng"]' | Chuỗi JSON các màu có sẵn |
| `stock` | INTEGER | | DEFAULT 100 | Số lượng tồn kho |
| `is_featured` | INTEGER | | DEFAULT 0 | 1: Sản phẩm nổi bật, 0: Thường |
| `created_at` | DATETIME | | DEFAULT CURRENT_TIMESTAMP | Ngày tạo sản phẩm |

### Bảng 4: `posts` (Bài viết / Blog thời trang)
| Tên cột | Kiểu dữ liệu | Khóa | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | PK | AUTOINCREMENT | Mã bài viết |
| `title` | TEXT | | NOT NULL | Tiêu đề bài viết |
| `slug` | TEXT | | UNIQUE | Đường dẫn tĩnh |
| `category` | TEXT | | DEFAULT 'Xu hướng' | Chuyên mục bài viết |
| `summary` | TEXT | | NULL | Đoạn tóm tắt nội dung |
| `content` | TEXT | | NOT NULL | Nội dung chi tiết bài viết |
| `thumbnail` | TEXT | | NOT NULL | Ảnh bìa bài viết |
| `author_id` | INTEGER | FK | REFERENCES users(id) | Mã tác giả bài viết |
| `author_name` | TEXT | | NOT NULL | Tên tác giả hiển thị |
| `views` | INTEGER | | DEFAULT 0 | Lượt xem bài viết |
| `created_at` | DATETIME | | DEFAULT CURRENT_TIMESTAMP | Ngày đăng |
| `updated_at` | DATETIME | | DEFAULT CURRENT_TIMESTAMP | Ngày sửa đổi |

### Bảng 5: `orders` (Đơn hàng)
| Tên cột | Kiểu dữ liệu | Khóa | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | PK | AUTOINCREMENT | Mã đơn hàng nội bộ |
| `order_code` | TEXT | | UNIQUE, NOT NULL | Mã đơn hàng gửi khách (VD: ORD-123456) |
| `user_id` | INTEGER | FK | REFERENCES users(id) | Mã người mua (nếu đã đăng nhập) |
| `customer_name` | TEXT | | NOT NULL | Họ tên người nhận hàng |
| `customer_email`| TEXT | | NOT NULL | Email nhận hóa đơn |
| `customer_phone`| TEXT | | NOT NULL | Số điện thoại nhận hàng |
| `shipping_address`| TEXT| | NOT NULL | Địa chỉ giao hàng chi tiết |
| `payment_method`| TEXT | | DEFAULT 'cod' | 'cod' hoặc 'banking' |
| `payment_status`| TEXT | | DEFAULT 'pending' | 'pending' hoặc 'paid' |
| `order_status` | TEXT | | DEFAULT 'pending' | 'pending', 'processing', 'shipping', 'completed', 'cancelled' |
| `total_amount` | REAL | | NOT NULL | Tổng tiền đơn hàng |
| `notes` | TEXT | | NULL | Ghi chú đơn hàng |
| `created_at` | DATETIME | | DEFAULT CURRENT_TIMESTAMP | Thời gian đặt hàng |

### Bảng 6: `order_items` (Chi tiết các mặt hàng trong đơn)
| Tên cột | Kiểu dữ liệu | Khóa | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | PK | AUTOINCREMENT | Mã định danh bản ghi |
| `order_id` | INTEGER | FK | REFERENCES orders(id) ON DELETE CASCADE | Mã đơn hàng cha |
| `product_id` | INTEGER | FK | REFERENCES products(id) | Mã sản phẩm |
| `product_name` | TEXT | | NOT NULL | Tên sản phẩm tại thời điểm mua |
| `price` | REAL | | NOT NULL | Đơn giá tại thời điểm mua |
| `quantity` | INTEGER | | NOT NULL | Số lượng mua |
| `size` | TEXT | | NULL | Kích cỡ đã chọn (S, M, L, XL) |
| `color` | TEXT | | NULL | Màu sắc đã chọn |
| `image` | TEXT | | NULL | Ảnh sản phẩm |

---

# CHƯƠNG 5: THIẾT KẾ KIẾN TRÚC & SƠ ĐỒ TUẦN TỰ

## 5.1. Kiến trúc hệ thống Client - Server RESTful
Ứng dụng được thiết kế theo mô hình 3 lớp hiện đại:
1. **Lớp Giao diện (Presentation Layer):** Chạy trên trình duyệt của người dùng (Client-side SPA). Xử lý tương tác mượt mà, chuyển trang không cần load lại qua hash routing (`#shop`, `#blog`, `#profile`), lưu trữ trạng thái người dùng bằng LocalStorage và gửi nhận dữ liệu qua API JSON.
2. **Lớp Xử lý nghiệp vụ (Business Logic / Controller Layer):** Xây dựng trên nền tảng Node.js / Express.js. Chia thành các bộ điều khiển chuyên trách (Auth, Users, Posts, Products, Orders, Stats) và các Middleware kiểm soát an ninh (Bảo mật JWT, Multer Upload, Xử lý lỗi tập trung).
3. **Lớp Dữ liệu (Data Access Layer):** Gồm bộ điều hợp kết nối SQLite, tự động thực thi di chuyển bảng (migrations) và tạo dữ liệu mẫu khởi tạo (seeding).

## 5.2. Sơ đồ tuần tự (Sequence Diagram)

### 1. Luồng Đăng ký & Gửi Email Xác thực
```
Client (User)           Express Server         SQLite Database         Nodemailer Service
     |                        |                       |                        |
     |--- 1. POST /register ->|                       |                        |
     |    (name, email, pass) |                       |                        |
     |                        |--- 2. Hash bcrypt --->|                        |
     |                        |--- 3. Gen OTP+Token ->|                        |
     |                        |--- 4. INSERT user --->|                        |
     |                        |<-- 5. User ID saved --|                        |
     |                        |                                                |
     |                        |--- 6. Gửi email xác thực kèm OTP ------------->|
     |                        |<-- 7. Kết quả gửi thành công ------------------|
     |                        |                                                |
     |<-- 8. Trả về thành công|                                                |
     |    (mở popup nhập OTP) |                                                |
     |                        |                                                |
     |--- 9. Nhập OTP ------->|                                                |
     |    POST /verify-email  |--- 10. SELECT user & so sánh OTP ------------->|
     |                        |<-- 11. OTP hợp lệ -----------------------------|
     |                        |--- 12. UPDATE is_verified = 1 ---------------->|
     |                        |--- 13. Ký mã JWT Token ------------------------|
     |<-- 14. Đăng nhập ngay -|                                                |
```

### 2. Luồng Quên & Đặt lại mật khẩu mới
```
Client (User)           Express Server         SQLite Database         Nodemailer Service
     |                        |                       |                        |
     |--- 1. Quên mật khẩu -->|                       |                        |
     |    POST /forgot-pass   |--- 2. SELECT user --->|                        |
     |                        |<-- 3. Tìm thấy User --|                        |
     |                        |--- 4. Gen OTP (15p) ->|                        |
     |                        |--- 5. UPDATE token -->|                        |
     |                        |--- 6. Gửi Email OTP đặt lại mật khẩu --------->|
     |<-- 7. Thông báo gửi ---|                                                |
     |                        |                                                |
     |--- 8. Đặt lại pass --->|                                                |
     |    POST /reset-pass    |--- 9. Đối chiếu OTP ->|                        |
     |    (email, OTP, pass)  |--- 10. Hash mật khẩu->|                        |
     |                        |--- 11. UPDATE pass -->|                        |
     |<-- 12. Thành công -----|                                                |
```

### 3. Luồng Quản lý bài viết (Tạo mới, Tìm kiếm, Sửa, Xóa)
```
User / Admin                 Express Server         SQLite Database
     |                             |                       |
     |--- 1. Tìm kiếm (GET /posts)->|                       |
     |    ?q=áo thun               |--- 2. SELECT WHERE -->|
     |<-- 3. Danh sách bài viết ---|<-- 4. Trả kết quả ----|
     |                             |                       |
     |--- 5. Tạo bài mới (POST) -->| (Verify JWT)          |
     |    (FormData: text + file)  |--- 6. INSERT post --->|
     |<-- 7. Bài viết đã lưu ------|<-- 8. Post ID mới ----|
     |                             |                       |
     |--- 9. Sửa bài (PUT /posts) ->| (Verify Author/Admin) |
     |    (cập nhật nội dung)      |--- 10. UPDATE post -->|
     |<-- 11. Cập nhật xong -------|<-- 12. Changes: 1 ----|
     |                             |                       |
     |--- 13. Xóa bài (DELETE) --->| (Verify Author/Admin) |
     |                             |--- 14. DELETE post -->|
     |<-- 15. Đã xóa thành công ---|<-- 16. Done ----------|
```

---

# CHƯƠNG 6: THIẾT KẾ GIAO DIỆN NGƯỜI DÙNG (UI/UX)

## 6.1. Nguyên lý thiết kế
Giao diện AURA FASHION được thiết kế theo triết lý **Modern Elegance & High Usability**:
- **Bảng màu:** Màu chủ đạo Slate 900 (`#0f172a`), màu nhấn Royal Blue (`#2563eb`), màu giá tiền và khuyến mãi Rose (`#e11d48`), màu thông báo trạng thái Emerald Green (`#10b981`) và Amber Gold (`#d97706`).
- **Typography:** Phông chữ Google Fonts `Plus Jakarta Sans` - một trong những phông chữ hình học hiện đại, sắc nét và dễ đọc nhất cho các trang thương mại điện tử quốc tế.
- **Micro-interactions:** Hiệu ứng di chuột (hover effects) phóng to nhẹ ảnh sản phẩm, nâng card 3D (`translateY(-6px)`), nút chuyển đổi Theme mượt mà.
- **Hệ thống Feedback:** Sử dụng Toast Notification ở góc dưới màn hình giúp người dùng luôn nhận biết được kết quả của mọi thao tác (thêm vào giỏ, đăng ký, đăng nhập, đổi mật khẩu...) mà không làm gián đoạn trải nghiệm duyệt web.

## 6.2. Thiết kế các phân hệ màn hình chính
1. **Trang chủ & Cửa hàng (Home & Shop):**
   - Banner Hero ấn tượng phong cách tạp chí thời trang, nút CTA điều hướng trực tiếp.
   - 4 khối cam kết chất lượng dịch vụ (Giao nhanh, Đổi trả 30 ngày, Thanh toán an toàn, Hỗ trợ 24/7).
   - Thanh bộ lọc danh mục dạng viên nhộng (Pills) chuyển đổi linh hoạt không cần tải lại trang.
   - Ô tìm kiếm sản phẩm và bộ lọc sắp xếp giá bán.
   - Thẻ sản phẩm với hình ảnh chuẩn tỉ lệ thời trang, nhãn giảm giá, giá bán và nút "Xem Nhanh".
2. **Hộp thoại Xem nhanh sản phẩm & Giỏ hàng:**
   - Cho phép chọn kích cỡ (Size: S, M, L, XL), chọn màu sắc và tăng giảm số lượng mua.
   - Giỏ hàng trực quan hiển thị danh sách sản phẩm, tự động tính tổng tiền.
3. **Phân hệ Bài viết thời trang (Blog):**
   - Thanh công cụ tìm kiếm bài viết theo từ khóa và lọc chủ đề.
   - Nút "Viết Bài Mới" cho phép cộng đồng và admin chia sẻ phong cách.
   - Màn hình đọc bài viết chi tiết chuẩn Typography với đề mục, hình ảnh minh họa và bài viết liên quan.
4. **Phân hệ Trang cá nhân (Profile):**
   - Thiết kế bố cục Sidebar - Content chia tab khoa học.
   - Hiển thị Avatar tròn có nút đổi ảnh nhanh.
   - Nhãn thông báo trạng thái kích hoạt Email (xanh nếu đã xác nhận, vàng kèm nút gửi lại nếu chưa).
   - Tab chỉnh sửa thông tin, tab đổi mật khẩu, tab lịch sử đơn hàng và tab bài viết của tôi.
5. **Phân hệ Quản trị viên (Admin Dashboard):**
   - 5 thẻ chỉ số kinh doanh: Doanh thu, Đơn hàng, Sản phẩm, Bài viết, Thành viên.
   - Bảng quản lý sản phẩm với tính năng thêm/sửa/xóa và quản lý kho.
   - Bảng cập nhật trạng thái đơn hàng (Chờ xử lý, Đang đóng gói, Đang giao, Hoàn tất, Hủy).

---

# CHƯƠNG 7: HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH HỆ THỐNG

## 7.1. Yêu cầu môi trường
- Máy tính cài đặt hệ điều hành: Windows, macOS hoặc Linux.
- Đã cài đặt **Node.js** (Khuyến nghị phiên bản 18.x trở lên; đã kiểm thử tương thích tuyệt đối với Node v24).
- Trình duyệt web hiện đại: Chrome, Edge, Firefox, Safari.

## 7.2. Các bước cài đặt và khởi chạy
1. **Mở thư mục dự án:**
   Mở terminal tại thư mục gốc của dự án `WEBDOAO_PTPMMNM_NHOM 4`.
2. **Cài đặt thư viện phụ thuộc:**
   ```bash
   npm install
   ```
3. **Khởi chạy ứng dụng:**
   ```bash
   npm start
   ```
   *(Hoặc `npm run dev`)*
4. **Truy cập hệ thống:**
   Mở trình duyệt web và truy cập địa chỉ:
   ```
   http://localhost:5000
   ```
   *Hệ thống sẽ tự động khởi tạo cơ sở dữ liệu SQLite `database.sqlite` và nạp sẵn toàn bộ danh mục, sản phẩm, bài viết và tài khoản mẫu.*

## 7.3. Danh sách tài khoản thử nghiệm
Hệ thống đã nạp sẵn 2 tài khoản mẫu phục vụ kiểm thử và chấm bài:

| Loại tài khoản | Địa chỉ Email | Mật khẩu | Quyền hạn (Role) |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@fashionhub.vn` | `Admin@123` | Quản trị toàn hệ thống |
| **Khách hàng Demo (User)** | `khachhang@fashionhub.vn` | `User@123` | Người dùng mua sắm & viết bài |

*(Tại màn hình Đăng Nhập, có sẵn các nút bấm chọn nhanh tài khoản thử nghiệm giúp người dùng và thầy cô đăng nhập tức thì mà không cần gõ phím).*

---
**NHÓM 4 - PHÁT TRIỂN PHẦN MỀM MÃ NGUỒN MỞ - 2026**

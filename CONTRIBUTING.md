# Hướng dẫn đóng góp - AURA FASHION

Cảm ơn bạn đã tham gia phát triển dự án AURA FASHION (Nhóm 4, môn PTPMMNM). Vui lòng đọc kỹ hướng dẫn này trước khi gửi code.

## Vai trò trong nhóm

| Vai trò | Quyền GitHub | Thành viên |
|---|---|---|
| Quản trị viên | Admin | Nguyễn Nữ Hồng Nhung |
| Người duy trì | Maintain | Phan Tấn Kiệt |
| Người đóng góp | Write | Nguyễn Thế Nhất |
| Người phân loại | Triage | Dương Quốc Bảo |
| Người xem | Read | Nguyễn Như Hồng Hạnh |

## Phân công file và vị trí kích hoạt của 4 thành viên

| Thành viên | File chức năng cần tạo | File Test cần viết | Vị trí mở kích hoạt trong code |
|---|---|---|---|
| **1. Nguyễn Thế Nhất** | • `server/routes/auth.js`<br>• `server/config/mailer.js`<br>• `server/middleware/auth.js`<br>• `public/js/auth.js`<br>• `public/css/auth.css` | • `tests/auth.test.js`<br>• `tests/middleware.test.js` | • `server.js` (dòng 26): mở `app.use('/api/auth', ...)`<br>• `public/index.html`: mở `<link rel="stylesheet" href="/css/auth.css">` và `<script src="/js/auth.js"></script>` |
| **2. Dương Quốc Bảo** | • `server/routes/orders.js`<br>• `server/routes/stats.js`<br>• `public/js/admin.js`<br>• `public/css/admin.css` | • `tests/orders.test.js`<br>• `tests/stats.test.js` | • `server.js` (dòng 29-30): mở `/api/orders` & `/api/stats`<br>• `public/index.html`: mở `admin.css` và `admin.js` |
| **3. Nguyễn Như Hồng Hạnh** | • `server/routes/posts.js`<br>• `public/js/blog.js`<br>• `public/css/blog.css` | • `tests/posts.test.js` | • `server.js` (dòng 33): mở `/api/posts`<br>• `public/index.html`: mở `blog.css` và `blog.js` |
| **4. Nguyễn Nữ Hồng Nhung** | • `server/routes/products.js`<br>• `public/js/shop.js`<br>• `public/css/shop.css` | • `tests/products.test.js` | • `server.js` (dòng 36): mở `/api/products`<br>• `public/index.html`: mở `shop.css` và `shop.js` |

> 💡 **Mẹo:** Toàn bộ code hoàn chỉnh và test đã được sao lưu tại nhánh `backup/full-project-with-tests`. Thành viên chỉ cần lấy đúng file của mình và tạo PR!


## Cài đặt môi trường

Yêu cầu: **Node.js** (phiên bản LTS) và **Git**.

```bash
git clone https://github.com/NHOM4-WEBDOAO/WEBDOAO_PTPMMNM_NHOM-4.git
cd WEBDOAO_PTPMMNM_NHOM-4
npm install
node server.js
```

Sau đó mở trình duyệt tại địa chỉ hiển thị trong terminal (thường là `http://localhost:3000`).

## Quy trình làm việc

1. Cập nhật nhánh `main` mới nhất:
```bash
   git checkout main
   git pull
```
2. Tạo nhánh mới cho công việc của bạn:
```bash
   git checkout -b feat/ten-chuc-nang
```
3. Viết code, tự chạy thử trước khi commit.
4. Commit và push:
```bash
   git add .
   git commit -m "feat: thêm giỏ hàng"
   git push -u origin feat/ten-chuc-nang
```
5. Mở **Pull Request** vào nhánh `main` và mô tả rõ bạn đã làm gì.
6. Chờ ít nhất **1 thành viên** review và duyệt trước khi merge.

**Không commit trực tiếp vào `main`.**

## Quy ước đặt tên nhánh

- `feat/...`: chức năng mới
- `fix/...`: sửa lỗi
- `docs/...`: tài liệu
- `refactor/...`: tái cấu trúc code

## Quy ước commit

Dùng dạng `loại: mô tả ngắn`:

- `feat: thêm chức năng đăng nhập`
- `fix: sửa lỗi hiển thị giỏ hàng`
- `docs: cập nhật README`
- `style:`, `refactor:`, `chore:`

## Quy ước code

- Đặt tên biến, hàm rõ nghĩa, nhất quán.
- Không đưa file nhạy cảm (`.env`, mật khẩu, khóa JWT, thông tin Nodemailer) lên GitHub.
- Không commit thư mục `node_modules/`.
- Mỗi Pull Request chỉ nên làm một việc.

## Báo lỗi và đề xuất

Tạo **Issue** mới trên GitHub, ghi rõ:
- Các bước tái hiện lỗi
- Kết quả mong đợi và kết quả thực tế
- Ảnh chụp màn hình (nếu có)

## Quy tắc ứng xử

Tôn trọng, lịch sự và hỗ trợ lẫn nhau trong nhóm.
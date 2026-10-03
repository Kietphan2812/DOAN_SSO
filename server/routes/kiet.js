const express = require('express');
const router = express.Router();

// 1. API: Chào hỏi thành viên Kiệt (GET /api/kiet/hello)
router.get('/hello', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Xin chào! Đây là module do thành viên Kiệt tạo ra.',
    author: 'Kiệt'
  });
});

// 2. API: Tính tiền giảm giá (POST /api/kiet/giam-gia)
router.post('/giam-gia', (req, res) => {
  const { giaGoc, phanTramGiam } = req.body;

  // Kiểm tra nếu người dùng không nhập giá
  if (!giaGoc || giaGoc <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập giá gốc hợp lệ!'
    });
  }

  // Tính tiền sau khi giảm
  const giam = phanTramGiam ? (giaGoc * phanTramGiam) / 100 : 0;
  const giaMoi = giaGoc - giam;

  res.status(200).json({
    success: true,
    giaGoc: giaGoc,
    giaSauGiam: giaMoi,
    tietKiem: giam
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * GET /api/user/profile
 * Xem thông tin trang cá nhân và lịch sử hoạt động
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await query.get(`
      SELECT id, name, email, phone, address, avatar, role, is_verified, created_at, updated_at
      FROM users WHERE id = ?
    `, [req.user.id]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    // Get orders of this user
    const orders = await query.all(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    `, [req.user.id]);

    // For each order, fetch items
    for (const order of orders) {
      order.items = await query.all(`SELECT * FROM order_items WHERE order_id = ?`, [order.id]);
    }

    // Get posts created by this user
    const posts = await query.all(`
      SELECT id, title, slug, category, summary, thumbnail, views, created_at
      FROM posts WHERE author_id = ? ORDER BY created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      user,
      orders,
      posts,
      stats: {
        totalOrders: orders.length,
        totalPosts: posts.length
      }
    });
  } catch (error) {
    console.error('Lỗi lấy profile:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tải trang cá nhân.' });
  }
});

/**
 * PUT /api/user/profile
 * Cập nhật thông tin cá nhân (họ tên, số điện thoại, địa chỉ)
 */
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Họ tên không được để trống.' });
    }

    await query.run(`
      UPDATE users 
      SET name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name.trim(), phone ? phone.trim() : '', address ? address.trim() : '', req.user.id]);

    // Return updated user
    const updatedUser = await query.get(`
      SELECT id, name, email, phone, address, avatar, role, is_verified, created_at, updated_at
      FROM users WHERE id = ?
    `, [req.user.id]);

    res.json({
      success: true,
      message: 'Cập nhật thông tin cá nhân thành công!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Lỗi cập nhật profile:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật thông tin cá nhân.' });
  }
});

/**
 * POST /api/user/avatar
 * Tải lên ảnh đại diện mới
 */
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file ảnh để tải lên.' });
    }

    const avatarUrl = '/uploads/' + req.file.filename;

    await query.run(`
      UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `, [avatarUrl, req.user.id]);

    res.json({
      success: true,
      message: 'Cập nhật ảnh đại diện thành công!',
      avatar: avatarUrl
    });
  } catch (error) {
    console.error('Lỗi upload avatar:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tải lên ảnh đại diện.' });
  }
});

/**
 * PUT /api/user/change-password
 * Đổi mật khẩu trong trang cá nhân
 */
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
    }

    const user = await query.get('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await query.run(`
      UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `, [hashedNew, req.user.id]);

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.'
    });
  } catch (error) {
    console.error('Lỗi đổi mật khẩu:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đổi mật khẩu.' });
  }
});

module.exports = router;

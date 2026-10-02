const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { JWT_SECRET } = require('../server/middleware/auth');
const { query } = require('../server/config/db');

describe('User Routes (/api/user)', () => {
  let userToken;
  let userId;

  beforeAll(async () => {
    // Look up demo user in DB
    const user = await query.get('SELECT id, email FROM users WHERE role = "user" LIMIT 1');
    userId = user ? user.id : 2;
    userToken = jwt.sign(
      { id: userId, email: user ? user.email : 'khachhang@fashionhub.vn', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/user/profile', () => {
    it('từ chối khi không có token (401)', async () => {
      const res = await request(app).get('/api/user/profile');
      expect(res.statusCode).toBe(401);
    });

    it('lấy thông tin trang cá nhân thành công với token hợp lệ (200)', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('id', userId);
      expect(Array.isArray(res.body.orders)).toBe(true);
      expect(Array.isArray(res.body.posts)).toBe(true);
      expect(res.body.stats).toHaveProperty('totalOrders');
    });
  });

  describe('PUT /api/user/profile', () => {
    it('trả về 400 nếu để trống họ tên', async () => {
      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: '   ' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('cập nhật họ tên, số điện thoại và địa chỉ thành công (200)', async () => {
      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Khách Hàng Mới',
          phone: '0912345678',
          address: '456 CMT8, Quận 3, TP.HCM'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.name).toBe('Khách Hàng Mới');
      expect(res.body.user.phone).toBe('0912345678');
    });
  });

  describe('PUT /api/user/change-password', () => {
    it('trả về 400 nếu thiếu mật khẩu cũ hoặc mật khẩu mới', async () => {
      const res = await request(app)
        .put('/api/user/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ currentPassword: 'test' });

      expect(res.statusCode).toBe(400);
    });

    it('trả về 400 nếu mật khẩu mới dưới 6 ký tự', async () => {
      const res = await request(app)
        .put('/api/user/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ currentPassword: 'User@123', newPassword: '123' });

      expect(res.statusCode).toBe(400);
    });

    it('trả về 400 khi nhập sai mật khẩu hiện tại', async () => {
      const res = await request(app)
        .put('/api/user/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ currentPassword: 'SaiMatKhau123!', newPassword: 'NewPassword@123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('không chính xác');
    });
  });
});

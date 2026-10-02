const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('Stats Routes (/api/stats)', () => {
  let adminToken;
  let userToken;

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

  describe('GET /api/stats/dashboard', () => {
    it('từ chối người dùng thông thường không có quyền admin (403)', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    it('cho phép Quản trị viên xem số liệu thống kê dashboard (200)', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toHaveProperty('totalUsers');
      expect(res.body.stats).toHaveProperty('totalProducts');
      expect(res.body.stats).toHaveProperty('totalOrders');
      expect(res.body.stats).toHaveProperty('totalRevenue');
      expect(Array.isArray(res.body.recentOrders)).toBe(true);
    });
  });
});

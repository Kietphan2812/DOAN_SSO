const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('Orders Routes (/api/orders)', () => {
  let adminToken;
  let userToken;
  let createdOrderId;

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

  describe('POST /api/orders (Đặt hàng mới)', () => {
    it('trả về 400 nếu thiếu thông tin giao hàng', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Nguyen Van A',
          items: [{ id: 1, name: 'Áo', price: 200000, quantity: 1 }]
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('đầy đủ thông tin giao hàng');
    });

    it('trả về 400 nếu danh sách giỏ hàng rỗng', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Nguyen Van A',
          customer_email: 'test@example.com',
          customer_phone: '0901234567',
          shipping_address: '123 Đường Số 1',
          items: []
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('trống');
    });

    it('khách vãng lai (không đăng nhập) đặt hàng thành công', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Khách Vãng Lai',
          customer_email: 'guest@example.com',
          customer_phone: '0909123456',
          shipping_address: '456 Lê Văn Sỹ, Q3, TP.HCM',
          payment_method: 'cod',
          notes: 'Giao giờ hành chính',
          items: [
            { id: 1, name: 'Áo Sơ Mi Oxford Cao Cấp', price: 389000, quantity: 2, size: 'L', color: 'Trắng' }
          ]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order).toHaveProperty('order_code');
      expect(res.body.order.total_amount).toBe(778000);

      createdOrderId = res.body.order.id;
    });

    it('người dùng đã đăng nhập đặt hàng thành công và lưu user_id', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          customer_name: 'Khách Hàng Thân Thiết',
          customer_email: 'khachhang@fashionhub.vn',
          customer_phone: '0909999999',
          shipping_address: '789 CMT8, Q10, TP.HCM',
          items: [
            { id: 2, name: 'Quần Jeans Slim Fit', price: 450000, quantity: 1, size: '32', color: 'Xanh Đậm' }
          ]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/orders/my-orders (Lịch sử đơn hàng cá nhân)', () => {
    it('từ chối khi người dùng chưa đăng nhập (401)', async () => {
      const res = await request(app).get('/api/orders/my-orders');

      expect(res.statusCode).toBe(401);
    });

    it('lấy danh sách đơn hàng của người dùng khi có token hợp lệ', async () => {
      const res = await request(app)
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.orders)).toBe(true);
    });
  });

  describe('GET /api/orders/all (Quản trị viên lấy tất cả đơn)', () => {
    it('từ chối người dùng thông thường (403)', async () => {
      const res = await request(app)
        .get('/api/orders/all')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    it('cho phép Quản trị viên (Admin) xem danh sách tất cả đơn hàng', async () => {
      const res = await request(app)
        .get('/api/orders/all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.orders)).toBe(true);
    });
  });

  describe('PUT /api/orders/:id/status (Cập nhật trạng thái đơn)', () => {
    it('Quản trị viên cập nhật trạng thái đơn hàng thành công', async () => {
      const res = await request(app)
        .put(`/api/orders/${createdOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          order_status: 'shipping',
          payment_status: 'paid'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('thành công');
    });
  });
});

const request = require('supertest');
const app = require('../server');
const { query } = require('../server/config/db');

// Mock mailer to avoid actual network / ethereal requests in test environment
jest.mock('../server/config/mailer', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({
    success: true,
    messageId: 'mock-verify-id',
    previewUrl: 'http://ethereal.email/mock',
    otp: '123456',
    verifyUrl: 'http://localhost:5000/#verify-email?token=mock'
  }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({
    success: true,
    messageId: 'mock-reset-id',
    previewUrl: 'http://ethereal.email/mock',
    otp: '654321',
    resetUrl: 'http://localhost:5000/#reset-password?token=mock'
  })
}));

describe('Auth Routes (/api/auth)', () => {
  const uniqueId = Date.now();
  const testEmail = `testuser_${uniqueId}@example.com`;
  const testPassword = 'Password@123';
  let authToken = '';

  describe('POST /api/auth/register', () => {
    it('trả về 400 nếu thiếu họ tên, email hoặc mật khẩu', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('đầy đủ họ tên');
    });

    it('trả về 400 nếu mật khẩu ngắn hơn 6 ký tự', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'shortpass@example.com',
          password: '123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('tối thiểu 6 ký tự');
    });

    it('đăng ký thành công người dùng mới với thông tin hợp lệ', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Nguyen Van Test',
          email: testEmail,
          password: testPassword,
          phone: '0987654321',
          address: '123 Nguyen Trai, Q5, TP.HCM'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('userId');
      expect(res.body.data.email).toBe(testEmail.toLowerCase());
    });

    it('trả về 400 khi cố gắng đăng ký email đã tồn tại', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Nguyen Van Test 2',
          email: testEmail,
          password: testPassword
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('đã được sử dụng');
    });
  });

  describe('POST /api/auth/login', () => {
    it('trả về 400 nếu thiếu email hoặc password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('trả về 401 khi tài khoản không tồn tại', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent_account_12345@domain.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('trả về 401 khi nhập sai mật khẩu', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword@999'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('đăng nhập thành công với tài khoản vừa tạo', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testEmail.toLowerCase());

      authToken = res.body.token;
    });

    it('đăng nhập thành công với tài khoản Admin mặc định', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@fashionhub.vn',
          password: 'Admin@123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('admin');
    });
  });

  describe('GET /api/auth/me', () => {
    it('lấy thông tin người dùng thành công khi có token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('email', testEmail.toLowerCase());
    });

    it('trả về 401 khi không gửi token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('trả về 400 nếu không gửi email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('trả về 404 nếu email không tồn tại trong hệ thống', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'unknown_mail_999@test.com' });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('xử lý quên mật khẩu thành công khi email hợp lệ', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testEmail });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Hướng dẫn đặt lại mật khẩu');
    });
  });

  describe('POST /api/auth/verify-email', () => {
    it('trả về 400 nếu thiếu email hoặc mã OTP/token', async () => {
      const res = await request(app)
        .post('/api/auth/verify-email')
        .send({ email: testEmail });

      expect(res.statusCode).toBe(400);
    });

    it('trả về 404 khi xác thực cho email không tồn tại', async () => {
      const res = await request(app)
        .post('/api/auth/verify-email')
        .send({
          email: 'notfound@test.com',
          otp: '123456'
        });

      expect(res.statusCode).toBe(404);
    });
  });
});

const request = require('supertest');
const app = require('../server');

describe('Leader Kiet Route Tests (Khung sườn ban đầu)', () => {
  it('GET /api/kiet/hello - Trả về lời chào của Kiệt', async () => {
    const res = await request(app).get('/api/kiet/hello');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.author).toBe('Kiệt');
  });

  it('POST /api/kiet/giam-gia - Tính giảm giá thành công khi có phần trăm giảm', async () => {
    const res = await request(app)
      .post('/api/kiet/giam-gia')
      .send({ giaGoc: 100000, phanTramGiam: 20 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.giaGoc).toBe(100000);
    expect(res.body.giaSauGiam).toBe(80000);
    expect(res.body.tietKiem).toBe(20000);
  });

  it('POST /api/kiet/giam-gia - Tính tiền khi không có phần trăm giảm', async () => {
    const res = await request(app)
      .post('/api/kiet/giam-gia')
      .send({ giaGoc: 50000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.giaSauGiam).toBe(50000);
    expect(res.body.tietKiem).toBe(0);
  });

  it('POST /api/kiet/giam-gia - Trả về 400 khi giá gốc không hợp lệ', async () => {
    const res = await request(app)
      .post('/api/kiet/giam-gia')
      .send({ giaGoc: 0, phanTramGiam: 10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('hợp lệ');
  });
});

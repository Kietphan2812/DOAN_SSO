const request = require('supertest');
const app = require('../server');

describe('Health Check & Server API Tests', () => {
  it('GET /api/health trả về trạng thái online và thông tin đồ án', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'online');
    expect(res.body).toHaveProperty('appName');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET đường dẫn lạ trả về fallback HTML cho SPA', async () => {
    const res = await request(app).get('/some-non-existent-page');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});

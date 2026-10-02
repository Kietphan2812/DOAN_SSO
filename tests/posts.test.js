const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('Posts Routes (/api/posts)', () => {
  let adminToken;
  let userToken;
  let otherUserToken;
  let createdPostId;

  beforeAll(() => {
    adminToken = jwt.sign(
      { id: 1, email: 'admin@fashionhub.vn', name: 'Admin Aura', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    userToken = jwt.sign(
      { id: 2, email: 'author@fashionhub.vn', name: 'Tác Giả', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    otherUserToken = jwt.sign(
      { id: 99, email: 'other@fashionhub.vn', name: 'Người Lạ', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/posts', () => {
    it('lấy danh sách bài viết và phân trang thành công', async () => {
      const res = await request(app).get('/api/posts');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.posts)).toBe(true);
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.categories)).toBe(true);
    });

    it('tìm kiếm bài viết theo từ khóa (q)', async () => {
      const res = await request(app).get('/api/posts?q=áo');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.posts)).toBe(true);
    });

    it('lọc bài viết theo danh mục', async () => {
      const res = await request(app).get('/api/posts?category=Xu hướng');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/posts', () => {
    it('từ chối khi chưa đăng nhập (401)', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Bài viết mới', content: 'Nội dung' });

      expect(res.statusCode).toBe(401);
    });

    it('trả về 400 nếu thiếu tiêu đề hoặc nội dung', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Chỉ có tiêu đề' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('tạo bài viết mới thành công khi có đủ dữ liệu và token', async () => {
      const uniqueTitle = `Xu Hướng Mới Đón Đầu 2026 ${Date.now()}`;
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: uniqueTitle,
          category: 'Xu hướng',
          summary: 'Tóm tắt bài viết phong cách thời trang',
          content: 'Nội dung chi tiết của bài viết phong cách thời trang năng động...',
          thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.post).toHaveProperty('id');
      expect(res.body.post.title).toBe(uniqueTitle);

      createdPostId = res.body.post.id;
    });
  });

  describe('GET /api/posts/:id', () => {
    it('xem chi tiết bài viết và tăng lượt xem', async () => {
      const res = await request(app).get(`/api/posts/${createdPostId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.post.id).toBe(createdPostId);
      expect(Array.isArray(res.body.related)).toBe(true);
    });

    it('trả về 404 cho bài viết không tồn tại', async () => {
      const res = await request(app).get('/api/posts/9999999');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('từ chối khi người dùng khác sửa bài viết không phải của mình (403)', async () => {
      const res = await request(app)
        .put(`/api/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ title: 'Sửa trộm bài' });

      expect(res.statusCode).toBe(403);
    });

    it('cho phép tác giả cập nhật bài viết thành công (200)', async () => {
      const updatedTitle = 'Tiêu Đề Đã Được Tác Giả Cập Nhật';
      const res = await request(app)
        .put(`/api/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: updatedTitle,
          content: 'Nội dung đã được biên tập lại...'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.post.title).toBe(updatedTitle);
    });

    it('trả về 404 khi sửa bài viết không tồn tại', async () => {
      const res = await request(app)
        .put('/api/posts/9999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Không tìm thấy' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('từ chối người dùng khác xóa bài viết (403)', async () => {
      const res = await request(app)
        .delete(`/api/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.statusCode).toBe(403);
    });

    it('Admin hoặc tác giả xóa bài viết thành công (200)', async () => {
      const res = await request(app)
        .delete(`/api/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('thành công');
    });

    it('trả về 404 khi xóa bài viết không tồn tại', async () => {
      const res = await request(app)
        .delete('/api/posts/9999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});

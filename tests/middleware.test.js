const jwt = require('jsonwebtoken');
const { verifyToken, requireAdmin, optionalAuth, JWT_SECRET } = require('../server/middleware/auth');

describe('Auth Middleware Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('verifyToken', () => {
    it('trả về 401 khi không có token trong header hoặc query', () => {
      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('cho phép tiếp tục (next) khi có Bearer token hợp lệ', () => {
      const payload = { id: 1, email: 'admin@fashionhub.vn', role: 'admin' };
      const token = jwt.sign(payload, JWT_SECRET);
      req.headers['authorization'] = `Bearer ${token}`;

      verifyToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(1);
      expect(req.user.role).toBe('admin');
    });

    it('cho phép tiếp tục khi token được truyền qua query params', () => {
      const payload = { id: 2, email: 'user@fashionhub.vn', role: 'user' };
      const token = jwt.sign(payload, JWT_SECRET);
      req.query.token = token;

      verifyToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user.id).toBe(2);
    });

    it('trả về 401 khi token không hợp lệ hoặc sai chữ ký', () => {
      req.headers['authorization'] = 'Bearer invalid-token-xyz';

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('cho phép next() khi người dùng có vai trò là admin', () => {
      const payload = { id: 1, email: 'admin@fashionhub.vn', role: 'admin' };
      const token = jwt.sign(payload, JWT_SECRET);
      req.headers['authorization'] = `Bearer ${token}`;

      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('trả về 403 Forbidden khi người dùng đăng nhập nhưng không phải admin', () => {
      const payload = { id: 2, email: 'user@fashionhub.vn', role: 'user' };
      const token = jwt.sign(payload, JWT_SECRET);
      req.headers['authorization'] = `Bearer ${token}`;

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('trả về 401 khi người dùng chưa đăng nhập', () => {
      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('giải mã token vào req.user nếu có token hợp lệ và gọi next()', () => {
      const payload = { id: 1, email: 'admin@fashionhub.vn', role: 'admin' };
      const token = jwt.sign(payload, JWT_SECRET);
      req.headers['authorization'] = `Bearer ${token}`;

      optionalAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(1);
    });

    it('vẫn gọi next() và không gán req.user khi không có token', () => {
      optionalAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('vẫn gọi next() mà không văng lỗi khi token không hợp lệ', () => {
      req.headers['authorization'] = 'Bearer malformed-token';

      optionalAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });
  });
});

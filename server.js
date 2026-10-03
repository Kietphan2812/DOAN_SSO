require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/user', require('./server/routes/user'));
app.use('/api/posts', require('./server/routes/posts'));
app.use('/api/products', require('./server/routes/products'));
app.use('/api/orders', require('./server/routes/orders'));
app.use('/api/stats', require('./server/routes/stats'));
app.use('/api/kiet', require('./server/routes/kiet'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'AURA FASHION - Open Source Project (Nhóm 4)',
    timestamp: new Date().toISOString()
  });
});

// Single Page Application fallback to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🚀 AURA FASHION STORE ĐANG CHẠY TẠI: http://localhost:${PORT}`);
    console.log(`  👤 Tài khoản Admin: admin@fashionhub.vn / Admin@123`);
    console.log(`  👤 Tài khoản Demo:  khachhang@fashionhub.vn / User@123`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;

/**
 * Authentication Module: Login, Register, Verify Email, Forgot/Reset Password
 */

const auth = {
  state: {
    user: null,
    isLoggedIn: false
  },

  init: async () => {
    const token = api.getToken();
    const cachedUser = api.getUser();

    if (token && cachedUser) {
      auth.state.user = cachedUser;
      auth.state.isLoggedIn = true;
      auth.updateUI();

      // Refresh user profile in background
      try {
        const res = await api.get('/auth/me');
        if (res.success && res.user) {
          auth.state.user = res.user;
          api.setUser(res.user);
          auth.updateUI();
        }
      } catch (e) {
        // Token might be expired
        if (e.message && e.message.includes('401')) {
          auth.logout();
        }
      }
    } else {
      auth.updateUI();
    }
  },

  updateUI: () => {
    const authActions = document.getElementById('nav-auth-actions');
    const userDropdown = document.getElementById('nav-user-dropdown');
    const adminLink = document.getElementById('nav-admin-link');
    const userMenuName = document.getElementById('user-menu-name');
    const userMenuEmail = document.getElementById('user-menu-email');
    const userAvatarImg = document.getElementById('user-avatar-img');

    if (auth.state.isLoggedIn && auth.state.user) {
      if (authActions) authActions.style.display = 'none';
      if (userDropdown) userDropdown.style.display = 'block';

      if (userMenuName) userMenuName.textContent = auth.state.user.name;
      if (userMenuEmail) userMenuEmail.textContent = auth.state.user.email;
      if (userAvatarImg && auth.state.user.avatar) {
        userAvatarImg.src = auth.state.user.avatar;
      }

      // Check admin privileges
      if (adminLink) {
        adminLink.style.display = auth.state.user.role === 'admin' ? 'block' : 'none';
      }
    } else {
      if (authActions) authActions.style.display = 'flex';
      if (userDropdown) userDropdown.style.display = 'none';
      if (adminLink) adminLink.style.display = 'none';
    }
  },

  // 1. Đăng ký tài khoản
  register: async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      showToast(res.message, 'success', 'Đăng ký thành công');

      // If devInfo exists (Ethereal test mode / simulated mail)
      if (res.data && res.data.devInfo) {
        auth.showDevEmailBanner(res.data.email, res.data.devInfo, 'verification');
      }

      // Open email verification modal and pre-fill email
      app.closeModal('modal-register');
      app.openModal('modal-verify-email');
      const emailField = document.getElementById('verify-email-input');
      if (emailField) emailField.value = res.data.email;

      return res;
    } catch (err) {
      showToast(err.message, 'error', 'Đăng ký thất bại');
      throw err;
    }
  },

  // 2. Xác nhận email qua OTP hoặc Token
  verifyEmail: async (email, otp, token) => {
    try {
      const res = await api.post('/auth/verify-email', { email, otp, token });
      showToast(res.message, 'success', 'Kích hoạt thành công');

      if (res.token && res.user) {
        api.setToken(res.token);
        api.setUser(res.user);
        auth.state.user = res.user;
        auth.state.isLoggedIn = true;
        auth.updateUI();
      }

      app.closeModal('modal-verify-email');
      return res;
    } catch (err) {
      showToast(err.message, 'error', 'Xác thực thất bại');
      throw err;
    }
  },

  // 3. Gửi lại email xác nhận
  resendVerification: async (email) => {
    try {
      const res = await api.post('/auth/resend-verification', { email });
      showToast(res.message, 'info', 'Đã gửi lại mã');

      if (res.devInfo) {
        auth.showDevEmailBanner(email, res.devInfo, 'verification');
      }
      return res;
    } catch (err) {
      showToast(err.message, 'error', 'Lỗi gửi lại');
      throw err;
    }
  },

  // 4. Đăng nhập
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      showToast(res.message, 'success', 'Đăng nhập thành công');

      api.setToken(res.token);
      api.setUser(res.user);
      auth.state.user = res.user;
      auth.state.isLoggedIn = true;
      auth.updateUI();

      app.closeModal('modal-login');

      // If user profile is active, refresh it
      if (window.location.hash === '#profile' && window.profile) {
        window.profile.loadProfile();
      }

      return res;
    } catch (err) {
      showToast(err.message, 'error', 'Đăng nhập thất bại');
      throw err;
    }
  },

  // 5. Yêu cầu Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      showToast(res.message, 'success', 'Đã gửi hướng dẫn');

      if (res.devInfo) {
        auth.showDevEmailBanner(email, res.devInfo, 'reset');
      }

      app.closeModal('modal-forgot-password');
      app.openModal('modal-reset-password');
      const resetEmailField = document.getElementById('reset-email-input');
      if (resetEmailField) resetEmailField.value = email;

      return res;
    } catch (err) {
      showToast(err.message, 'error', 'Yêu cầu thất bại');
      throw err;
    }
  },

  // 6. Tạo lại mật khẩu mới
  resetPassword: async (email, otp, token, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password', { email, otp, token, newPassword });
      showToast(res.message, 'success', 'Cập nhật thành công');

      app.closeModal('modal-reset-password');
      app.openModal('modal-login');

      // Pre-fill email in login
      const loginEmail = document.getElementById('login-email');
      if (loginEmail) loginEmail.value = email;

      return res;
    } catch (err) {
      showToast(err.message, 'error', 'Đặt lại mật khẩu thất bại');
      throw err;
    }
  },

  // 7. Đăng xuất
  logout: () => {
    api.setToken(null);
    api.setUser(null);
    auth.state.user = null;
    auth.state.isLoggedIn = false;
    auth.updateUI();
    showToast('Bạn đã đăng xuất an toàn.', 'info', 'Đăng xuất');

    if (window.location.hash === '#profile' || window.location.hash === '#admin') {
      window.location.hash = '#home';
    }
  },

  // Helper: Hiển thị banner email test thuận tiện khi chạy demo
  showDevEmailBanner: (email, devInfo, type) => {
    const bannerBox = document.getElementById(type === 'verification' ? 'dev-verify-banner' : 'dev-reset-banner');
    if (!bannerBox) return;

    bannerBox.style.display = 'block';
    bannerBox.innerHTML = `
      <div class="dev-email-banner">
        <strong>⚡ [DEMO / KIỂM THỬ TỰ ĐỘNG] THÔNG TIN EMAIL VỪA GỬI:</strong>
        <div>Người nhận: <b>${email}</b></div>
        <div>Mã OTP xác nhận: <b style="font-size: 1.15rem; color: #0284c7;">${devInfo.otp}</b></div>
        ${devInfo.previewUrl ? `<div><a href="${devInfo.previewUrl}" target="_blank" class="dev-email-link">✉ Mở Hộp Thư Trực Tiếp (Ethereal Mail)</a></div>` : ''}
      </div>
    `;

    // Pre-fill OTP into inputs for effortless testing
    const otpInput = document.getElementById(type === 'verification' ? 'verify-otp-input' : 'reset-otp-input');
    if (otpInput) otpInput.value = devInfo.otp;
  }
};

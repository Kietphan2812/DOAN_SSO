/**
 * User Profile Management Module
 * - Quản lý trang cá nhân
 * - Cập nhật thông tin cá nhân (họ tên, SĐT, địa chỉ)
 * - Tải lên ảnh đại diện (Avatar)
 * - Đổi mật khẩu
 * - Lịch sử đơn hàng của tôi
 * - Bài viết của tôi
 */

const profile = {
  state: {
    activeTab: 'info',
    user: null,
    orders: [],
    posts: []
  },

  init: () => {
    profile.loadProfile();
  },

  switchTab: (tabId) => {
    profile.state.activeTab = tabId;

    // Update buttons
    document.querySelectorAll('.profile-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update tab panes
    document.querySelectorAll('.profile-tab-pane').forEach(pane => {
      pane.style.display = pane.id === `tab-${tabId}` ? 'block' : 'none';
    });
  },

  loadProfile: async () => {
    if (!auth.state.isLoggedIn) {
      showToast('Vui lòng đăng nhập để xem trang cá nhân.', 'warning');
      window.location.hash = '#home';
      app.openModal('modal-login');
      return;
    }

    try {
      const res = await api.get('/user/profile');
      if (res.success) {
        profile.state.user = res.user;
        profile.state.orders = res.orders || [];
        profile.state.posts = res.posts || [];
        profile.renderProfile();
      }
    } catch (e) {
      showToast(e.message, 'error', 'Lỗi tải trang cá nhân');
    }
  },

  renderProfile: () => {
    const u = profile.state.user;
    if (!u) return;

    // Sidebar
    const avatarImg = document.getElementById('profile-sidebar-avatar');
    const nameEl = document.getElementById('profile-sidebar-name');
    const emailEl = document.getElementById('profile-sidebar-email');
    const verifyBadge = document.getElementById('profile-sidebar-verify');

    if (avatarImg) avatarImg.src = u.avatar || '/uploads/default-avatar.png';
    if (nameEl) nameEl.textContent = u.name;
    if (emailEl) emailEl.textContent = u.email;

    if (verifyBadge) {
      if (u.is_verified) {
        verifyBadge.innerHTML = `<span class="badge badge-success">✓ Email Đã Kích Hoạt</span>`;
      } else {
        verifyBadge.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 6px; align-items: center;">
            <span class="badge badge-warning">⚠ Chưa Kích Hoạt Email</span>
            <button class="btn btn-sm btn-outline" onclick="auth.resendVerification('${u.email}')" style="font-size: 0.75rem;">
              Gửi lại mã xác nhận
            </button>
          </div>
        `;
      }
    }

    // Info Form
    const nameInput = document.getElementById('profile-edit-name');
    const emailInput = document.getElementById('profile-edit-email');
    const phoneInput = document.getElementById('profile-edit-phone');
    const addressInput = document.getElementById('profile-edit-address');

    if (nameInput) nameInput.value = u.name || '';
    if (emailInput) emailInput.value = u.email || '';
    if (phoneInput) phoneInput.value = u.phone || '';
    if (addressInput) addressInput.value = u.address || '';

    // Render Orders
    profile.renderOrders();

    // Render My Posts
    profile.renderMyPosts();
  },

  // Cập nhật thông tin cá nhân
  updateInfo: async (e) => {
    e.preventDefault();

    const name = document.getElementById('profile-edit-name').value.trim();
    const phone = document.getElementById('profile-edit-phone').value.trim();
    const address = document.getElementById('profile-edit-address').value.trim();

    if (!name) {
      showToast('Họ tên không được để trống.', 'warning');
      return;
    }

    try {
      const res = await api.put('/user/profile', { name, phone, address });
      if (res.success && res.user) {
        showToast(res.message, 'success', 'Cập nhật thành công');
        profile.state.user = res.user;
        api.setUser(res.user);
        auth.state.user = res.user;
        auth.updateUI();
        profile.renderProfile();
      }
    } catch (err) {
      showToast(err.message, 'error', 'Cập nhật thất bại');
    }
  },

  // Upload Avatar
  uploadAvatar: async (input) => {
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.post('/user/avatar', formData, true);
      if (res.success && res.avatar) {
        showToast('Ảnh đại diện đã được cập nhật!', 'success');
        if (profile.state.user) profile.state.user.avatar = res.avatar;
        const cached = api.getUser();
        if (cached) {
          cached.avatar = res.avatar;
          api.setUser(cached);
          auth.state.user = cached;
          auth.updateUI();
        }
        profile.renderProfile();
      }
    } catch (err) {
      showToast(err.message, 'error', 'Tải ảnh đại diện thất bại');
    }
  },

  // Đổi mật khẩu
  changePassword: async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('profile-current-password').value;
    const newPassword = document.getElementById('profile-new-password').value;
    const confirmPassword = document.getElementById('profile-confirm-password').value;

    if (!currentPassword || !newPassword) {
      showToast('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp.', 'warning');
      return;
    }

    try {
      const res = await api.put('/user/change-password', { currentPassword, newPassword });
      showToast(res.message, 'success', 'Đổi mật khẩu thành công');

      // Clear inputs
      document.getElementById('profile-current-password').value = '';
      document.getElementById('profile-new-password').value = '';
      document.getElementById('profile-confirm-password').value = '';
    } catch (err) {
      showToast(err.message, 'error', 'Đổi mật khẩu thất bại');
    }
  },

  // Hiển thị đơn hàng cá nhân
  renderOrders: () => {
    const container = document.getElementById('profile-orders-list');
    if (!container) return;

    if (profile.state.orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="color: var(--text-light); margin-bottom: 12px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <p>Bạn chưa có đơn hàng nào.</p>
          <button class="btn btn-sm btn-accent" style="margin-top: 12px;" onclick="window.location.hash = '#shop'">
            Khám phá bộ sưu tập ngay
          </button>
        </div>
      `;
      return;
    }

    const statusMap = {
      pending: { text: 'Chờ xử lý', cls: 'badge-warning' },
      processing: { text: 'Đang đóng gói', cls: 'badge-accent' },
      shipping: { text: 'Đang giao hàng', cls: 'badge-primary' },
      completed: { text: 'Đã giao thành công', cls: 'badge-success' },
      cancelled: { text: 'Đã hủy', cls: 'badge-danger' }
    };

    container.innerHTML = `
      <div class="orders-table-wrapper">
        <table class="table-custom">
          <thead>
            <tr>
              <th>Mã Đơn Hàng</th>
              <th>Ngày Đặt</th>
              <th>Tổng Tiền</th>
              <th>Phương Thức</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${profile.state.orders.map(o => {
              const st = statusMap[o.order_status] || { text: o.order_status, cls: 'badge-primary' };
              return `
                <tr>
                  <td><strong>${o.order_code}</strong></td>
                  <td>${formatDate(o.created_at)}</td>
                  <td style="font-weight: 700; color: var(--rose);">${formatCurrency(o.total_amount)}</td>
                  <td>${o.payment_method === 'banking' ? 'Chuyển khoản QR' : 'COD (Tiền mặt)'}</td>
                  <td><span class="badge ${st.cls}">${st.text}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // Hiển thị bài viết của tôi
  renderMyPosts: () => {
    const container = document.getElementById('profile-my-posts-list');
    if (!container) return;

    if (profile.state.posts.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="color: var(--text-light); margin-bottom: 12px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <p>Bạn chưa tạo bài viết thời trang nào.</p>
          <button class="btn btn-sm btn-accent" style="margin-top: 12px;" onclick="blog.openCreateModal()">
            + Viết bài chia sẻ phong cách
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = profile.state.posts.map(p => `
      <div class="my-post-item">
        <div class="my-post-info">
          <img src="${p.thumbnail || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'}" class="my-post-thumb">
          <div>
            <h4 style="font-size: 1rem; margin-bottom: 4px;">
              <a href="javascript:void(0)" onclick="blog.openPostDetail(${p.id})">${p.title}</a>
            </h4>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              ${p.category} • ${formatDate(p.created_at)} • 👁 ${p.views} lượt xem
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-outline" onclick="blog.openEditModal(${p.id})">Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="blog.confirmDeletePost(${p.id})">Xóa</button>
        </div>
      </div>
    `).join('');
  }
};

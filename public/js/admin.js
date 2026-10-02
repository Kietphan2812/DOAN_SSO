/**
 * Admin Portal Management Module
 * - Quản lý thống kê (Dashboard Stats)
 * - Quản lý sản phẩm (CRUD Products)
 * - Quản lý bài viết (CRUD Posts)
 * - Quản lý đơn hàng (Update Order Status)
 */

const admin = {
  state: {
    activeTab: 'stats',
    stats: null,
    products: [],
    orders: [],
    posts: [],
    editingProductId: null
  },

  init: async () => {
    if (!auth.state.isLoggedIn || auth.state.user.role !== 'admin') {
      showToast('Truy cập bị từ chối. Chỉ dành cho Quản trị viên.', 'error');
      window.location.hash = '#home';
      return;
    }
    await admin.loadStats();
    await admin.loadProducts();
    await admin.loadOrders();
    await admin.loadPosts();
  },

  switchTab: (tabId) => {
    admin.state.activeTab = tabId;

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.style.display = pane.id === `admin-tab-${tabId}` ? 'block' : 'none';
    });
  },

  // 1. Thống kê tổng quan
  loadStats: async () => {
    try {
      const res = await api.get('/stats/dashboard');
      if (res.success && res.stats) {
        admin.state.stats = res.stats;
        admin.renderStats();
      }
    } catch (e) {
      console.error('Lỗi tải thống kê:', e);
    }
  },

  renderStats: () => {
    const s = admin.state.stats;
    if (!s) return;

    const revEl = document.getElementById('stat-revenue');
    const ordersEl = document.getElementById('stat-orders');
    const prodsEl = document.getElementById('stat-products');
    const postsEl = document.getElementById('stat-posts');
    const usersEl = document.getElementById('stat-users');

    if (revEl) revEl.textContent = formatCurrency(s.totalRevenue);
    if (ordersEl) ordersEl.textContent = s.totalOrders;
    if (prodsEl) prodsEl.textContent = s.totalProducts;
    if (postsEl) postsEl.textContent = s.totalPosts;
    if (usersEl) usersEl.textContent = s.totalUsers;
  },

  // 2. Quản lý sản phẩm
  loadProducts: async () => {
    try {
      const res = await api.get('/products');
      if (res.success) {
        admin.state.products = res.products;
        admin.renderProducts();
      }
    } catch (e) {
      console.error('Lỗi tải sản phẩm admin:', e);
    }
  },

  renderProducts: () => {
    const container = document.getElementById('admin-products-table-body');
    if (!container) return;

    container.innerHTML = admin.state.products.map(p => `
      <tr>
        <td>
          <img src="${p.image}" style="width: 44px; height: 50px; object-fit: cover; border-radius: 6px;">
        </td>
        <td>
          <div style="font-weight: 700;">${p.name}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${p.category_name || 'Thời trang'}</div>
        </td>
        <td style="font-weight: 700; color: var(--rose);">${formatCurrency(p.price)}</td>
        <td>${p.stock} cái</td>
        <td>${p.is_featured ? '<span class="badge badge-accent">Nổi bật</span>' : '<span class="badge badge-primary">Thường</span>'}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-sm btn-outline" onclick="admin.openEditProductModal(${p.id})">Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="admin.deleteProduct(${p.id})">Xóa</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  openCreateProductModal: () => {
    admin.state.editingProductId = null;
    document.getElementById('product-form-modal-title').textContent = 'Thêm Sản Phẩm Thời Trang';
    document.getElementById('admin-prod-name').value = '';
    document.getElementById('admin-prod-cat').value = '1';
    document.getElementById('admin-prod-price').value = '';
    document.getElementById('admin-prod-orig-price').value = '';
    document.getElementById('admin-prod-image-url').value = '';
    document.getElementById('admin-prod-image-file').value = '';
    document.getElementById('admin-prod-sizes').value = 'S, M, L, XL';
    document.getElementById('admin-prod-colors').value = 'Đen, Trắng, Be';
    document.getElementById('admin-prod-stock').value = '50';
    document.getElementById('admin-prod-featured').checked = false;
    document.getElementById('admin-prod-desc').value = '';

    app.openModal('modal-admin-product-editor');
  },

  openEditProductModal: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      if (res.success && res.product) {
        const p = res.product;
        admin.state.editingProductId = p.id;

        document.getElementById('product-form-modal-title').textContent = 'Cập Nhật Sản Phẩm';
        document.getElementById('admin-prod-name').value = p.name || '';
        document.getElementById('admin-prod-cat').value = p.category_id || '1';
        document.getElementById('admin-prod-price').value = p.price || '';
        document.getElementById('admin-prod-orig-price').value = p.original_price || '';
        document.getElementById('admin-prod-image-url').value = p.image || '';
        document.getElementById('admin-prod-image-file').value = '';
        document.getElementById('admin-prod-sizes').value = Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes || '';
        document.getElementById('admin-prod-colors').value = Array.isArray(p.colors) ? p.colors.join(', ') : p.colors || '';
        document.getElementById('admin-prod-stock').value = p.stock || 50;
        document.getElementById('admin-prod-featured').checked = !!p.is_featured;
        document.getElementById('admin-prod-desc').value = p.description || '';

        app.openModal('modal-admin-product-editor');
      }
    } catch (e) {
      showToast(e.message, 'error', 'Lỗi tải chi tiết sản phẩm');
    }
  },

  saveProduct: async (e) => {
    e.preventDefault();

    const name = document.getElementById('admin-prod-name').value.trim();
    const category_id = document.getElementById('admin-prod-cat').value;
    const price = document.getElementById('admin-prod-price').value;
    const original_price = document.getElementById('admin-prod-orig-price').value;
    const imageUrl = document.getElementById('admin-prod-image-url').value.trim();
    const imageFile = document.getElementById('admin-prod-image-file');
    const sizes = document.getElementById('admin-prod-sizes').value.trim();
    const colors = document.getElementById('admin-prod-colors').value.trim();
    const stock = document.getElementById('admin-prod-stock').value;
    const is_featured = document.getElementById('admin-prod-featured').checked ? 1 : 0;
    const description = document.getElementById('admin-prod-desc').value.trim();

    if (!name || !price) {
      showToast('Tên và giá sản phẩm là bắt buộc.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category_id', category_id);
    formData.append('price', price);
    if (original_price) formData.append('original_price', original_price);
    if (imageUrl) formData.append('imageUrl', imageUrl);
    if (imageFile.files.length > 0) formData.append('imageFile', imageFile.files[0]);
    formData.append('sizes', sizes);
    formData.append('colors', colors);
    formData.append('stock', stock);
    formData.append('is_featured', is_featured);
    formData.append('description', description);

    try {
      if (admin.state.editingProductId) {
        await api.put(`/products/${admin.state.editingProductId}`, formData, true);
        showToast('Cập nhật sản phẩm thành công!', 'success');
      } else {
        await api.post('/products', formData, true);
        showToast('Thêm sản phẩm mới thành công!', 'success');
      }

      app.closeModal('modal-admin-product-editor');
      await admin.loadProducts();
      await admin.loadStats();
      if (window.shop) shop.loadProducts();
    } catch (err) {
      showToast(err.message, 'error', 'Lỗi lưu sản phẩm');
    }
  },

  deleteProduct: async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      showToast(res.message, 'success', 'Đã xóa sản phẩm');
      await admin.loadProducts();
      await admin.loadStats();
      if (window.shop) shop.loadProducts();
    } catch (err) {
      showToast(err.message, 'error', 'Lỗi xóa sản phẩm');
    }
  },

  // 3. Quản lý đơn hàng
  loadOrders: async () => {
    try {
      const res = await api.get('/orders/all');
      if (res.success) {
        admin.state.orders = res.orders;
        admin.renderOrders();
      }
    } catch (e) {
      console.error('Lỗi tải đơn hàng:', e);
    }
  },

  renderOrders: () => {
    const container = document.getElementById('admin-orders-table-body');
    if (!container) return;

    container.innerHTML = admin.state.orders.map(o => `
      <tr>
        <td><strong>${o.order_code}</strong></td>
        <td>
          <div style="font-weight: 700;">${o.customer_name}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${o.customer_phone} • ${o.shipping_address}</div>
        </td>
        <td style="font-weight: 700; color: var(--rose);">${formatCurrency(o.total_amount)}</td>
        <td>
          <select class="form-control" style="padding: 4px 8px; font-size: 0.85rem;" onchange="admin.updateOrderStatus(${o.id}, this.value)">
            <option value="pending" ${o.order_status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
            <option value="processing" ${o.order_status === 'processing' ? 'selected' : ''}>Đang đóng gói</option>
            <option value="shipping" ${o.order_status === 'shipping' ? 'selected' : ''}>Đang giao</option>
            <option value="completed" ${o.order_status === 'completed' ? 'selected' : ''}>Đã giao</option>
            <option value="cancelled" ${o.order_status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
          </select>
        </td>
        <td>${formatDate(o.created_at)}</td>
      </tr>
    `).join('');
  },

  updateOrderStatus: async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { order_status: status });
      showToast(res.message, 'success', 'Cập nhật đơn hàng');
      await admin.loadStats();
    } catch (err) {
      showToast(err.message, 'error', 'Lỗi cập nhật trạng thái');
    }
  },

  // 4. Quản lý bài viết trong Admin
  loadPosts: async () => {
    try {
      const res = await api.get('/posts');
      if (res.success) {
        admin.state.posts = res.posts;
        admin.renderPosts();
      }
    } catch (e) {
      console.error('Lỗi tải bài viết admin:', e);
    }
  },

  renderPosts: () => {
    const container = document.getElementById('admin-posts-table-body');
    if (!container) return;

    container.innerHTML = admin.state.posts.map(p => `
      <tr>
        <td>
          <img src="${p.thumbnail}" style="width: 56px; height: 40px; object-fit: cover; border-radius: 6px;">
        </td>
        <td>
          <div style="font-weight: 700;">${p.title}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${p.category} • Tác giả: ${p.author_name}</div>
        </td>
        <td>${p.views}</td>
        <td>${formatDate(p.created_at)}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-sm btn-outline" onclick="blog.openEditModal(${p.id})">Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="blog.confirmDeletePost(${p.id})">Xóa</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
};

/**
 * Central API Client and Toast Notification System
 */

const API_BASE = '/api';

// Toast Notification
function showToast(message, type = 'info', title = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const defaultTitles = {
    success: 'Thành công',
    error: 'Lỗi',
    warning: 'Cảnh báo',
    info: 'Thông báo'
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'ℹ'}</div>
    <div class="toast-content">
      <div class="toast-title">${title || defaultTitles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// Format Currency VND
function formatCurrency(amount) {
  if (isNaN(amount) || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Format Date
function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// API request wrapper
const api = {
  getToken: () => localStorage.getItem('aura_token'),

  setToken: (token) => {
    if (token) localStorage.setItem('aura_token', token);
    else localStorage.removeItem('aura_token');
  },

  getUser: () => {
    try {
      const u = localStorage.getItem('aura_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  setUser: (user) => {
    if (user) localStorage.setItem('aura_user', JSON.stringify(user));
    else localStorage.removeItem('aura_user');
  },

  request: async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const headers = options.headers || {};

    const token = api.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!options.isFormData && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg = data.message || `Lỗi yêu cầu (${res.status})`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  get: (endpoint, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return api.request(url, { method: 'GET' });
  },

  post: (endpoint, body = {}, isFormData = false) => {
    return api.request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      isFormData
    });
  },

  put: (endpoint, body = {}, isFormData = false) => {
    return api.request(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
      isFormData
    });
  },

  delete: (endpoint) => {
    return api.request(endpoint, { method: 'DELETE' });
  }
};

/**
 * Main Application Orchestrator & Router
 */

const app = {
  // 1. Quản lý Modal
  openModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      // If no other modals are open, restore scroll
      if (!document.querySelector('.modal-overlay.open')) {
        document.body.style.overflow = '';
      }
    }
  },

  closeAllModals: () => {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  },

  // 2. Chế độ Sáng / Tối (Dark / Light Theme)
  initTheme: () => {
    const saved = localStorage.getItem('aura_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    app.updateThemeIcon(saved);
  },

  toggleTheme: () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('aura_theme', next);
    app.updateThemeIcon(next);
  },

  updateThemeIcon: (theme) => {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      const sunSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
      const moonSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      btn.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
      btn.title = theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối';
    }
  },

  // 3. SPA Router (Hash-based)
  handleRoute: () => {
    const hash = window.location.hash || '#home';
    const [path, queryPart] = hash.split('?');

    // Parse URL params from hash
    const params = new URLSearchParams(queryPart || '');

    // Highlight navbar links
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === path);
    });

    // Close mobile nav menu
    const navLinks = document.getElementById('main-nav-links');
    if (navLinks) navLinks.classList.remove('open');

    // Show/hide sections
    const sections = {
      '#home': 'view-home',
      '#shop': 'view-shop',
      '#blog': 'view-blog',
      '#blog-detail': 'view-blog-detail',
      '#profile': 'view-profile',
      '#admin': 'view-admin'
    };

    Object.keys(sections).forEach(r => {
      const secEl = document.getElementById(sections[r]);
      if (secEl) {
        secEl.style.display = r === path ? 'block' : 'none';
      }
    });

    // Route specific actions
    if (path === '#home' || path === '#shop') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.shop && shop.state.products.length === 0) {
        shop.loadProducts();
      }
    } else if (path === '#blog') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.blog) blog.loadPosts();
    } else if (path === '#profile') {
      if (window.profile) profile.init();
    } else if (path === '#admin') {
      if (window.admin) admin.init();
    } else if (path === '#verify-email') {
      // Auto handle verify email link clicked from email
      const token = params.get('token');
      const email = params.get('email');
      if (token && email) {
        auth.verifyEmail(email, null, token).then(() => {
          window.location.hash = '#home';
        });
      } else {
        app.openModal('modal-verify-email');
        if (email) {
          const el = document.getElementById('verify-email-input');
          if (el) el.value = email;
        }
      }
    } else if (path === '#reset-password') {
      // Auto handle reset password link clicked from email
      const token = params.get('token');
      const email = params.get('email');
      app.openModal('modal-reset-password');
      if (email) {
        const el = document.getElementById('reset-email-input');
        if (el) el.value = email;
      }
      if (token) {
        const el = document.getElementById('reset-token-hidden');
        if (el) el.value = token;
      }
    }
  },

  // 4. Khởi tạo toàn bộ ứng dụng
  init: async () => {
    app.initTheme();

    // Event listeners for closing modals on overlay click or Esc
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        app.closeModal(e.target.id);
      }
      // Close user dropdown when clicking outside
      const dropdown = document.getElementById('nav-user-dropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        app.closeAllModals();
      }
    });

    // Mobile nav toggle
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('main-nav-links');
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });
    }

    // User avatar dropdown toggle
    const userBtn = document.getElementById('nav-user-btn');
    const userDropdown = document.getElementById('nav-user-dropdown');
    if (userBtn && userDropdown) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('open');
      });
    }

    // Route listener
    window.addEventListener('hashchange', app.handleRoute);

    // Initialize modules
    await auth.init();
    await shop.init();
    await blog.init();

    // Trigger initial route
    app.handleRoute();
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', app.init);

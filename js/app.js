/* ========================================================
   QUALITY GLASS EMPORIUM - MASTER APP ROUTER & CONTROLLER
   ======================================================== */

window.App = {
  currentRoute: "home",
  routeParam: null,

  init() {
    this.bindEvents();
    this.renderHeader();
    this.renderFooter();
    this.navigate("home");
  },

  bindEvents() {
    window.addEventListener("cart_updated", () => {
      this.updateCartBadge();
      if (this.currentRoute === 'cart') this.renderCurrentView();
    });

    window.addEventListener("auth_state_changed", () => {
      this.renderHeader();
      this.renderCurrentView();
    });
  },

  navigate(route, param = null) {
    this.currentRoute = route;
    this.routeParam = param;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderHeader();
    this.renderCurrentView();
  },

  renderHeader() {
    const header = document.getElementById("main-header");
    if (!header) return;

    const user = window.Auth.getCurrentUser();
    const cart = window.Store.getCart();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    header.innerHTML = `
      <div class="flex justify-between items-center px-4 md:px-8 w-full max-w-container-max mx-auto h-16">
        <div class="flex items-center gap-4">
          <a href="#" onclick="window.App.navigate('home')" class="font-headline-md text-xl md:text-2xl font-bold text-primary dark:text-primary-fixed flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">crop_original</span>
            Quality Glass Emporium
          </a>
        </div>

        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#" onclick="window.App.navigate('home')" class="hover:text-secondary ${this.currentRoute === 'home' ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant'}">Home</a>
          <a href="#" onclick="window.App.navigate('cart')" class="hover:text-secondary ${this.currentRoute === 'cart' ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant'} flex items-center gap-1">
            Cart ${cartCount > 0 ? `<span class="bg-secondary text-white text-xs px-2 py-0.5 rounded-full font-bold">${cartCount}</span>` : ''}
          </a>
          ${user ? `
            <a href="#" onclick="window.App.navigate('account-dashboard')" class="hover:text-secondary ${this.currentRoute === 'account-dashboard' ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant'}">My Account</a>
            ${user.role === 'admin' ? `
              <a href="#" onclick="window.App.navigate('admin-dashboard')" class="badge badge-gold px-3 py-1 text-xs">Admin Workspace</a>
            ` : ''}
          ` : `
            <a href="#" onclick="window.App.navigate('login')" class="hover:text-secondary text-on-surface-variant">Sign In</a>
            <a href="#" onclick="window.App.navigate('register')" class="btn btn-primary text-xs py-1.5 px-4">Register</a>
          `}
        </nav>

        <div class="flex items-center gap-3">
          <button onclick="window.App.toggleTheme()" class="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors" title="Toggle Dark/Light Mode">
            <span class="material-symbols-outlined text-xl" id="theme-icon">dark_mode</span>
          </button>
        </div>
      </div>
    `;
  },

  renderFooter() {
    const footer = document.getElementById("main-footer");
    if (!footer) return;

    footer.innerHTML = `
      <div class="w-full py-8 mt-12 bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant/30 text-xs">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-8 max-w-container-max mx-auto">
          <div class="space-y-3">
            <div class="font-bold text-base text-primary dark:text-primary-fixed">Quality Glass Emporium</div>
            <p class="text-on-surface-variant">Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, UP.</p>
            <p class="text-on-surface-variant font-semibold">Open Daily until 9:00 PM • Rating: 4.9 Stars</p>
          </div>

          <div class="flex flex-col gap-2 text-on-surface-variant">
            <strong class="text-on-surface font-bold">Collections</strong>
            <a href="#" onclick="window.App.navigate('home')" class="hover:text-secondary">Custom Photo Framing</a>
            <a href="#" onclick="window.App.navigate('home')" class="hover:text-secondary">Museum UV Glass</a>
            <a href="#" onclick="window.App.navigate('home')" class="hover:text-secondary">Acrylic Float Panels</a>
          </div>

          <div class="flex flex-col gap-2 text-on-surface-variant">
            <strong class="text-on-surface font-bold">Admin Credentials</strong>
            <span>Developer: <code class="font-mono text-secondary">@kaatya6547</code></span>
            <span>Owner: <code class="font-mono text-secondary">@Ajmal6547</code></span>
            <span>Default Password: <code class="font-mono">Vis6547@</code></span>
          </div>

          <div class="space-y-2 text-on-surface-variant">
            <strong class="text-on-surface font-bold">Platform Tech</strong>
            <p>Vercel Serverless Ready + Supabase PostgreSQL & Storage Persistence.</p>
            <p class="text-[11px] opacity-75">© 2026 Quality Glass Emporium. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  },

  renderCurrentView() {
    const main = document.getElementById("main-content");
    if (!main) return;

    let html = "";

    switch (this.currentRoute) {
      case "home":
        html = window.HomeView.render();
        break;
      case "product-detail":
        html = window.ProductDetailView.render(this.routeParam);
        break;
      case "cart":
        html = window.CartView.render();
        break;
      case "checkout":
        html = window.CheckoutView.render();
        break;
      case "login":
        html = window.LoginView.render();
        break;
      case "register":
        html = window.RegisterView.render();
        break;
      case "account-dashboard":
        html = window.UserDashboardView.render();
        break;
      case "admin":
      case "admin-dashboard":
        html = window.AdminDashboardView.render();
        break;
      case "admin-orders-approval":
        html = window.AdminOrdersApprovalView.render();
        break;
      case "admin-products":
        html = window.AdminProductsView.render();
        break;
      case "admin-categories":
        html = window.AdminCategoriesView.render();
        break;
      case "admin-banners":
        html = window.AdminBannersView.render();
        break;
      case "admin-branding":
        html = window.AdminBrandingView.render();
        break;
      case "admin-coupons":
        html = window.AdminCouponsView.render();
        break;
      case "admin-shipping":
        html = window.AdminShippingView.render();
        break;
      case "admin-reviews":
        html = window.AdminReviewsView.render();
        break;
      case "admin-seo":
        html = window.AdminSeoView.render();
        break;
      case "admin-content":
        html = window.AdminContentView.render();
        break;
      case "admin-customers":
        html = window.AdminCustomersView.render();
        break;
      case "admin-gateways":
        html = window.AdminGatewaysView.render();
        break;
      case "admin-logistics":
        html = window.AdminLogisticsView.render();
        break;
      case "admin-audit":
        html = window.AdminAuditView.render();
        break;
      default:
        html = window.HomeView.render();
    }

    main.innerHTML = html;
  },

  updateCartBadge() {
    this.renderHeader();
  },

  toggleTheme() {
    document.documentElement.classList.toggle("dark");
    const icon = document.getElementById("theme-icon");
    if (icon) {
      icon.textContent = document.documentElement.classList.contains("dark") ? "light_mode" : "dark_mode";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});

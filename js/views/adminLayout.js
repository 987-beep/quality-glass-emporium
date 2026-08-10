/* ========================================================
   QUALITY GLASS EMPORIUM - ADMIN WORKSPACE LAYOUT
   ======================================================== */

window.AdminLayout = {
  render(contentHtml, activeSection = "dashboard") {
    if (!window.Auth.isAdmin()) {
      return `
        <div class="max-w-md mx-auto py-16 p-8 rounded-2xl bg-surface border border-outline-variant/30 text-center space-y-6 shadow-sm">
          <span class="material-symbols-outlined text-6xl text-error">gpp_bad</span>
          <h2 class="font-headline-lg text-primary dark:text-primary-fixed">Access Denied</h2>
          <p class="font-body-md text-on-surface-variant">Administrative privileges required to access the management workspace.</p>
          <button onclick="window.App.navigate('login')" class="btn btn-primary">Sign In as Administrator</button>
        </div>
      `;
    }

    const orders = window.Store.getItem(window.Store.STORAGE_KEYS.ORDERS, []);
    const pendingCount = orders.filter(o => o.payment_status === 'pending' || o.payment_status === 'under_review').length;
    const user = window.Auth.getCurrentUser();

    const navItems = [
      { id: "admin-dashboard", label: "Dashboard Overview", icon: "dashboard" },
      { id: "admin-orders-approval", label: "Payment Proof Approvals", icon: "verified_user", badge: pendingCount > 0 ? pendingCount : null },
      { id: "admin-products", label: "Products & Pricing", icon: "inventory_2" },
      { id: "admin-categories", label: "Category Taxonomy", icon: "category" },
      { id: "admin-banners", label: "Banners & Carousels", icon: "view_carousel" },
      { id: "admin-branding", label: "Store Info & Branding", icon: "storefront" },
      { id: "admin-coupons", label: "Coupons & Discounts", icon: "local_offer" },
      { id: "admin-shipping", label: "Shipping & Taxes", icon: "local_shipping" },
      { id: "admin-reviews", label: "Reviews Moderation", icon: "rate_review" },
      { id: "admin-seo", label: "SEO Meta Settings", icon: "travel_explore" },
      { id: "admin-content", label: "Website Content CMS", icon: "article" },
      { id: "admin-customers", label: "Customer Accounts", icon: "group" },
      { id: "admin-gateways", label: "Payment Gateways", icon: "payments" },
      { id: "admin-logistics", label: "Order Logistics", icon: "package_2" },
      { id: "admin-audit", label: "Admin Audit Logs", icon: "policy" }
    ];

    return `
      <div class="flex flex-col md:flex-row min-h-screen bg-surface-container-lowest text-on-surface -mx-4 -my-8 md:-mx-16">
        <!-- Admin Sidebar Navigation -->
        <aside class="w-full md:w-64 bg-primary text-white p-6 space-y-6 flex-shrink-0 shadow-lg">
          <div class="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 class="font-headline-md text-lg font-bold text-white">Admin Workspace</h2>
              <p class="text-xs text-blue-200">Quality Glass Emporium</p>
            </div>
            <span class="badge badge-gold text-[10px]">VERCEL READY</span>
          </div>

          <nav class="space-y-1">
            ${navItems.map(item => `
              <button onclick="window.App.navigate('${item.id}')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${activeSection === item.id ? 'bg-secondary text-white font-bold shadow-sm' : 'text-blue-100 hover:bg-white/10'}">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-sm">${item.icon}</span>
                  <span>${item.label}</span>
                </div>
                ${item.badge ? `<span class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">${item.badge}</span>` : ''}
              </button>
            `).join('')}
          </nav>

          <div class="pt-6 border-t border-white/10 text-xs text-blue-200 space-y-2">
            <div class="font-semibold text-white">Active Session:</div>
            <div class="truncate">${user ? user.displayName : 'Admin'} (${user ? user.username : ''})</div>
            <button onclick="window.Auth.logout(); window.App.navigate('home');" class="btn btn-secondary text-xs w-full py-2 mt-2 border-white/30 text-white hover:bg-white/10">
              Sign Out
            </button>
          </div>
        </aside>

        <!-- Main Workspace Workspace Content -->
        <main class="flex-1 p-6 md:p-10 bg-surface-container-lowest overflow-y-auto space-y-6">
          ${contentHtml}
        </main>
      </div>
    `;
  }
};

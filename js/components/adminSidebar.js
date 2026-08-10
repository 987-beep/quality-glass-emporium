/* ============================================================
   QUALITY GLASS EMPORIUM - ADMIN NAVIGATION SIDEBAR
   ============================================================ */

window.renderAdminSidebar = function() {
  const store = window.appStore;
  const currentTab = store.adminSubTab;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'payments', label: 'Payment Approvals', icon: 'payments', badge: 'Review' },
    { id: 'orders', label: 'Orders & Logistics', icon: 'local_shipping' },
    { id: 'products', label: 'Products & Pricing', icon: 'inventory_2' },
    { id: 'categories', label: 'Categories Taxonomy', icon: 'category' },
    { id: 'customers', label: 'Customer Accounts', icon: 'group' },
    { id: 'banners', label: 'Banners & Carousels', icon: 'view_carousel' },
    { id: 'branding', label: 'Store Info & Branding', icon: 'storefront' },
    { id: 'content', label: 'Edit Website CMS', icon: 'edit_note' },
    { id: 'coupons', label: 'Coupons & Discounts', icon: 'sell' },
    { id: 'shipping', label: 'Shipping & Taxes', icon: 'local_offer' },
    { id: 'gateways', label: 'Payment Gateways', icon: 'account_balance' },
    { id: 'reviews', label: 'Reviews Moderation', icon: 'rate_review' },
    { id: 'seo', label: 'SEO & Meta Settings', icon: 'travel_explore' },
    { id: 'workspace', label: 'Workspace Overview', icon: 'web_asset' },
    { id: 'tools', label: 'Audit Logs & Tools', icon: 'history' }
  ];

  return `
    <aside class="w-full md:w-64 bg-primary text-white shrink-0 rounded-xl p-4 flex flex-col justify-between shadow-lg">
      <div class="space-y-6">
        <!-- Admin Title -->
        <div class="px-3 py-2 border-b border-white/10 flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-400">admin_panel_settings</span>
          <div>
            <div class="font-bold text-sm text-white">Management Center</div>
            <div class="text-[10px] text-gray-400">Quality Glass Emporium</div>
          </div>
        </div>

        <!-- Navigation Tabs List -->
        <nav class="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          ${tabs.map(t => `
            <button onclick="window.appStore.setAdminSubTab('${t.id}')" class="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${currentTab === t.id ? 'bg-secondary text-white font-bold shadow-sm' : 'text-gray-300 hover:bg-primary-container hover:text-white'}">
              <span class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-lg">${t.icon}</span>
                <span>${t.label}</span>
              </span>
              ${t.badge ? `
                <span class="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  ${t.badge}
                </span>
              ` : ''}
            </button>
          `).join('')}
        </nav>
      </div>

      <!-- Footer Action -->
      <div class="pt-4 border-t border-white/10 space-y-2">
        <button onclick="window.appStore.navigateTo('home')" class="w-full bg-white/10 text-white hover:bg-white/20 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-sm">storefront</span>
          View Storefront
        </button>
        <button onclick="window.appStore.logout()" class="w-full text-red-300 hover:text-red-100 px-3 py-1.5 text-xs text-center block">
          Sign Out Admin
        </button>
      </div>
    </aside>
  `;
};

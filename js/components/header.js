/* ============================================================
   QUALITY GLASS EMPORIUM - HEADER NAVIGATION COMPONENT
   ============================================================ */

window.renderHeader = function() {
  const store = window.appStore;
  const cartCount = store.getCartCount();
  const user = store.currentUser;
  const currentView = store.currentView;

  return `
    <header class="w-full top-0 sticky z-50 bg-white/90 dark:bg-charcoal-bg/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-outline/20 shadow-sm transition-colors">
      <div class="flex justify-between items-center px-4 md:px-12 w-full max-w-[1280px] mx-auto h-20">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-3 cursor-pointer" onclick="window.appStore.navigateTo('home')">
          <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-secondary-container shadow-md">
            <span class="material-symbols-outlined text-2xl">crop_original</span>
          </div>
          <div>
            <div class="font-headline-md font-bold text-primary dark:text-white leading-tight">
              Quality Glass Emporium
            </div>
            <div class="text-xs text-subtle-gray tracking-wide flex items-center gap-1 font-medium">
              <span class="w-2 h-2 rounded-full bg-success-green inline-block"></span>
              PNT Colony, Raebareli
            </div>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 font-medium">
          <button onclick="window.appStore.navigateTo('home')" class="${currentView === 'home' ? 'text-secondary dark:text-secondary-container font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant dark:text-gray-300 hover:text-secondary transition-colors'}">
            Home
          </button>
          <button onclick="window.appStore.navigateTo('catalog')" class="${currentView === 'catalog' ? 'text-secondary dark:text-secondary-container font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant dark:text-gray-300 hover:text-secondary transition-colors'}">
            Collections
          </button>
          <button onclick="window.appStore.navigateTo('configurator')" class="${currentView === 'configurator' ? 'text-secondary dark:text-secondary-container font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant dark:text-gray-300 hover:text-secondary transition-colors'}">
            Custom Framing
          </button>
          ${user && user.role === 'admin' ? `
            <button onclick="window.appStore.navigateTo('admin')" class="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1 shadow-sm hover:bg-primary-container">
              <span class="material-symbols-outlined text-base">admin_panel_settings</span>
              Admin Workspace
            </button>
          ` : ''}
        </nav>

        <!-- Right Tools & Cart -->
        <div class="flex items-center gap-4">
          <!-- Cart Button -->
          <button onclick="window.appStore.navigateTo('cart')" class="relative p-2.5 text-on-surface hover:bg-surface-container-high rounded-full transition-colors active:scale-95" title="View Cart">
            <span class="material-symbols-outlined text-2xl text-primary dark:text-white">shopping_bag</span>
            ${cartCount > 0 ? `
              <span class="absolute top-1 right-1 bg-secondary text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                ${cartCount}
              </span>
            ` : ''}
          </button>

          <!-- User Account / Login Button -->
          ${user ? `
            <div class="relative group">
              <button onclick="${user.role === 'admin' ? "window.appStore.navigateTo('admin')" : "window.appStore.navigateTo('customer')"}" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-all border border-outline-variant/40">
                <div class="w-8 h-8 rounded-full ${user.role === 'admin' ? 'bg-amber-600' : 'bg-secondary'} text-white flex items-center justify-center text-sm font-bold">
                  ${user.name.charAt(0).toUpperCase()}
                </div>
                <span class="font-medium text-sm text-primary dark:text-white max-w-[120px] truncate hidden sm:inline-block">
                  ${user.name}
                </span>
                <span class="material-symbols-outlined text-sm text-gray-500">expand_more</span>
              </button>

              <!-- Dropdown Menu -->
              <div class="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-charcoal-bg rounded-xl shadow-xl border border-outline-variant/30 py-2 hidden group-hover:block z-50">
                <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                  <div class="font-bold text-sm text-primary dark:text-white truncate">${user.name}</div>
                  <div class="text-xs text-subtle-gray truncate">${user.email}</div>
                  <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}">
                    ${user.role}
                  </span>
                </div>
                ${user.role === 'admin' ? `
                  <button onclick="window.appStore.navigateTo('admin')" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-surface-container flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">dashboard</span>
                    Admin Dashboard
                  </button>
                ` : ''}
                <button onclick="window.appStore.navigateTo('customer')" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-surface-container flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">receipt_long</span>
                  My Orders & Profile
                </button>
                <button onclick="window.appStore.logout()" class="w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-100 dark:border-gray-800">
                  <span class="material-symbols-outlined text-lg">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          ` : `
            <button onclick="window.appStore.navigateTo('login')" class="bg-secondary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-all shadow-sm active:scale-95 flex items-center gap-1">
              <span class="material-symbols-outlined text-lg">account_circle</span>
              Sign In
            </button>
          `}
        </div>
      </div>
    </header>
  `;
};

/* ============================================================
   QUALITY GLASS EMPORIUM - CATALOG & PRODUCT LISTING VIEW
   ============================================================ */

window.renderCatalogView = function() {
  const store = window.appStore;
  let products = [...window.SEED_DATA.products];
  const categories = window.SEED_DATA.categories;

  // Filter by category
  if (store.selectedCategory && store.selectedCategory !== 'all') {
    products = products.filter(p => p.categoryId === store.selectedCategory);
  }

  // Filter by search query
  if (store.searchQuery) {
    const q = store.searchQuery.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  // Sort
  if (store.sortBy === 'price_asc') {
    products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (store.sortBy === 'price_desc') {
    products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (store.sortBy === 'rating') {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return `
    <div class="space-y-8 animate-fade-in">
      <!-- Title & Search Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-charcoal-bg p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <h1 class="font-display-lg text-2xl md:text-3xl font-bold text-primary dark:text-white">
            Glass & Photo Frame Catalog
          </h1>
          <p class="text-xs text-subtle-gray">
            Showing ${products.length} products
          </p>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <!-- Search input -->
          <div class="relative flex-1 md:w-64">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input 
              type="text" 
              value="${store.searchQuery || ''}"
              placeholder="Search catalog..." 
              oninput="window.appStore.searchQuery = this.value; window.appStore.notify();"
              class="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            >
          </div>

          <!-- Sort dropdown -->
          <select onchange="window.appStore.sortBy = this.value; window.appStore.notify();" class="p-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 font-medium">
            <option value="featured" ${store.sortBy === 'featured' ? 'selected' : ''}>Featured</option>
            <option value="price_asc" ${store.sortBy === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price_desc" ${store.sortBy === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
            <option value="rating" ${store.sortBy === 'rating' ? 'selected' : ''}>Highest Rated</option>
          </select>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        <button 
          onclick="window.appStore.selectedCategory = 'all'; window.appStore.notify();" 
          class="px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${store.selectedCategory === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}"
        >
          All Products
        </button>
        ${categories.map(c => `
          <button 
            onclick="window.appStore.selectedCategory = '${c.id}'; window.appStore.notify();" 
            class="px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${store.selectedCategory === c.id ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}"
          >
            ${c.name}
          </button>
        `).join('')}
      </div>

      <!-- Products Grid -->
      ${products.length > 0 ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          ${products.map(p => window.renderProductCard(p)).join('')}
        </div>
      ` : `
        <div class="text-center py-16 bg-white dark:bg-charcoal-bg rounded-2xl border border-outline-variant/30 space-y-4">
          <span class="material-symbols-outlined text-5xl text-gray-300">search_off</span>
          <h3 class="font-bold text-lg text-primary dark:text-white">No products found</h3>
          <p class="text-xs text-subtle-gray">Try adjusting your search query or category filter.</p>
          <button onclick="window.appStore.searchQuery = ''; window.appStore.selectedCategory = 'all'; window.appStore.notify();" class="bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold">
            Reset Filters
          </button>
        </div>
      `}
    </div>
  `;
};

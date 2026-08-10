/* ========================================================
   QUALITY GLASS EMPORIUM - STOREFRONT HOME VIEW
   ======================================================== */

window.HomeView = {
  render() {
    const banners = window.Store.getItem(window.Store.STORAGE_KEYS.BANNERS, []);
    const categories = window.Store.getItem(window.Store.STORAGE_KEYS.CATEGORIES, []);
    const products = window.Store.getItem(window.Store.STORAGE_KEYS.PRODUCTS, []).filter(p => p.is_published);
    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});

    const activeBanner = banners.length > 0 ? banners[0] : {
      title: "Frame Your Memories in Perfect Clarity",
      subtitle: "Discover our curated collection of premium glass and acrylic frames, custom crafted in Raebareli.",
      image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"
    };

    return `
      <!-- Hero Carousel Section -->
      <section class="relative rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-center gap-8 p-6 md:p-12 mb-12 shadow-sm">
        <div class="flex-1 space-y-6 z-10">
          <span class="badge badge-gold">Artisan Modern • Raebareli</span>
          <h1 class="font-display-lg text-primary dark:text-primary-fixed">${activeBanner.title}</h1>
          <p class="font-body-lg text-on-surface-variant max-w-lg">${activeBanner.subtitle}</p>
          <div class="flex flex-wrap gap-4 pt-2">
            <button onclick="window.App.navigate('categories')" class="btn btn-primary">
              <span class="material-symbols-outlined">grid_view</span> Shop Collections
            </button>
            <button onclick="window.App.navigate('product-detail', 'p1')" class="btn btn-secondary">
              <span class="material-symbols-outlined">auto_awesome</span> Custom Framing
            </button>
          </div>
        </div>
        <div class="flex-1 w-full relative h-[320px] md:h-[400px] rounded-xl overflow-hidden shadow-md">
          <img src="${activeBanner.image_url}" alt="Quality Glass Hero" class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700">
        </div>
      </section>

      <!-- Search & Store Banner -->
      <section class="mb-12">
        <div class="max-w-2xl mx-auto space-y-4">
          <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input type="text" id="home-search-input" onkeyup="window.HomeView.filterProducts(this.value)" placeholder="Search for frames, museum glass, acrylic, sizes..." class="input-field pl-12 py-4 rounded-xl text-base shadow-sm">
          </div>
          <div class="flex flex-wrap items-center justify-between text-xs text-on-surface-variant px-2">
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm text-secondary">location_on</span> ${settings.address || window.APP_CONFIG.LOCATION}</span>
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm text-secondary">schedule</span> ${settings.opening_hours || window.APP_CONFIG.HOURS}</span>
          </div>
        </div>
      </section>

      <!-- Category Filter Pills -->
      <section class="mb-10">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-headline-lg text-primary dark:text-primary-fixed">Product Categories</h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <button onclick="window.HomeView.filterCategory('all')" class="cat-pill-btn active px-4 py-2 rounded-full border border-primary bg-primary text-white text-sm font-medium transition-all">
            All Framing & Glass
          </button>
          ${categories.map(cat => `
            <button onclick="window.HomeView.filterCategory('${cat.id}')" class="cat-pill-btn px-4 py-2 rounded-full border border-outline-variant hover:border-secondary text-on-surface text-sm font-medium transition-all">
              ${cat.name}
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Featured Products Grid -->
      <section class="mb-16">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="font-headline-lg text-primary dark:text-primary-fixed">Featured Collection</h2>
            <p class="font-body-md text-on-surface-variant">Handcrafted in Raebareli with museum-grade precision</p>
          </div>
        </div>

        <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${products.map(product => this.renderProductCard(product)).join('')}
        </div>
      </section>
    `;
  },

  renderProductCard(product) {
    const hasDiscount = product.sale_price && product.sale_price < product.price;
    const primaryImg = product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/400?text=Quality+Glass";
    
    return `
      <div class="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        <div onclick="window.App.navigate('product-detail', '${product.id}')" class="aspect-square relative overflow-hidden bg-surface-container-low">
          <img src="${primaryImg}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          ${hasDiscount ? `<span class="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">SALE</span>` : ''}
          <span class="absolute top-3 right-3 bg-surface/80 backdrop-blur-md text-on-surface text-xs font-medium px-2 py-1 rounded-md border border-outline-variant/40">
            SKU: ${product.sku}
          </span>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 onclick="window.App.navigate('product-detail', '${product.id}')" class="font-headline-md text-lg text-on-surface font-semibold hover:text-secondary transition-colors line-clamp-1">
              ${product.name}
            </h3>
            <p class="font-body-md text-xs text-on-surface-variant mt-1 line-clamp-2">${product.description}</p>
          </div>
          <div class="mt-4 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
            <div>
              <div class="font-headline-md text-lg font-bold text-primary dark:text-primary-fixed">
                $${(product.sale_price || product.price).toFixed(2)}
              </div>
              ${hasDiscount ? `<div class="text-xs text-on-surface-variant line-through">$${product.price.toFixed(2)}</div>` : ''}
            </div>
            <button onclick="window.Store.addToCart('${product.id}', 1)" class="btn btn-primary p-2.5 rounded-lg text-xs">
              <span class="material-symbols-outlined text-sm">add_shopping_cart</span> Add
            </button>
          </div>
        </div>
      </div>
    `;
  },

  filterProducts(query) {
    const q = query.toLowerCase().trim();
    const products = window.Store.getItem(window.Store.STORAGE_KEYS.PRODUCTS, []).filter(p => p.is_published);
    const filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    const grid = document.getElementById("products-grid");
    if (grid) {
      grid.innerHTML = filtered.length > 0 ? filtered.map(p => this.renderProductCard(p)).join('') : `
        <div class="col-span-full py-12 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
          <p class="font-body-lg">No framing or glass products found matching "${query}"</p>
        </div>
      `;
    }
  },

  filterCategory(catId) {
    const products = window.Store.getItem(window.Store.STORAGE_KEYS.PRODUCTS, []).filter(p => p.is_published);
    const filtered = catId === 'all' ? products : products.filter(p => p.category_id === catId);
    const grid = document.getElementById("products-grid");
    if (grid) {
      grid.innerHTML = filtered.map(p => this.renderProductCard(p)).join('');
    }
  }
};

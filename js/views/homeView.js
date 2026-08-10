/* ============================================================
   QUALITY GLASS EMPORIUM - HOME STOREFRONT VIEW
   ============================================================ */

window.renderHomeView = function() {
  const store = window.appStore;
  const products = window.SEED_DATA.products;
  const categories = window.SEED_DATA.categories;
  const banners = window.SEED_DATA.banners;

  return `
    <div class="space-y-12 animate-fade-in">
      <!-- Hero Banner Section -->
      <section class="relative rounded-2xl overflow-hidden bg-primary text-white flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 shadow-2xl">
        <div class="flex-1 space-y-6 z-10">
          <span class="inline-block bg-tertiary-gold text-white text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-sm">
            Handcrafted in Raebareli, UP
          </span>
          <h1 class="font-display-lg text-3xl md:text-5xl font-extrabold leading-tight text-white">
            ${banners[0].title}
          </h1>
          <p class="font-body-lg text-gray-200 max-w-lg text-sm md:text-base leading-relaxed">
            ${banners[0].subtitle}
          </p>
          <div class="flex flex-wrap gap-4 pt-2">
            <button onclick="window.appStore.navigateTo('catalog')" class="bg-secondary text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-secondary/90 shadow-lg active:scale-95 transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">grid_view</span>
              Shop Collections
            </button>
            <button onclick="window.appStore.navigateTo('configurator')" class="border-2 border-white text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-white hover:text-primary active:scale-95 transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">design_services</span>
              Custom Framing
            </button>
          </div>
        </div>
        <div class="flex-1 w-full relative h-[320px] md:h-[400px] rounded-xl overflow-hidden shadow-inner">
          <img src="${banners[0].imageUrl}" alt="Hero Glass Frame" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
        </div>
      </section>

      <!-- Global Search Bar -->
      <section class="max-w-2xl mx-auto w-full">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-subtle-gray text-xl">search</span>
          <input 
            type="text" 
            placeholder="Search photo frames, acrylic glass, mirrors, or custom cut sizes..." 
            onkeydown="if(event.key === 'Enter') { window.appStore.searchQuery = this.value; window.appStore.navigateTo('catalog'); }"
            class="w-full pl-12 pr-28 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-charcoal-bg focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-sm font-medium shadow-sm"
          >
          <button onclick="const val = this.previousElementSibling.value; window.appStore.searchQuery = val; window.appStore.navigateTo('catalog');" class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-container transition-colors">
            Search
          </button>
        </div>
      </section>

      <!-- Categories Grid -->
      <section>
        <div class="flex justify-between items-end mb-6">
          <div>
            <h2 class="font-display-lg text-2xl font-bold text-primary dark:text-white">Shop by Category</h2>
            <p class="text-xs text-subtle-gray">Browse our specialized glass, photo frame, and mirror categories.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${categories.map(cat => `
            <div onclick="window.appStore.selectedCategory = '${cat.id}'; window.appStore.navigateTo('catalog');" class="bg-white dark:bg-charcoal-bg rounded-xl border border-outline-variant/30 overflow-hidden group cursor-pointer hover:shadow-lg transition-all p-4 flex flex-col items-center text-center space-y-3">
              <div class="w-full aspect-video rounded-lg overflow-hidden relative">
                <img src="${cat.imageUrl}" alt="${cat.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              </div>
              <h3 class="font-bold text-base text-primary dark:text-white group-hover:text-secondary transition-colors">
                ${cat.name}
              </h3>
              <p class="text-xs text-subtle-gray line-clamp-2">
                ${cat.description}
              </p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Featured Products -->
      <section>
        <div class="flex justify-between items-end mb-6">
          <div>
            <h2 class="font-display-lg text-2xl font-bold text-primary dark:text-white">Featured Collections</h2>
            <p class="text-xs text-subtle-gray">Popular photo frames and architectural glass products.</p>
          </div>
          <button onclick="window.appStore.navigateTo('catalog')" class="text-secondary font-bold text-xs hover:underline flex items-center gap-1">
            View All Products <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          ${products.filter(p => p.isFeatured).map(p => window.renderProductCard(p)).join('')}
        </div>
      </section>

      <!-- Interactive Configurator Teaser -->
      <section>
        ${window.renderFrameConfigurator()}
      </section>

      <!-- Raebareli Store Highlight Banner -->
      <section class="bg-surface-container rounded-2xl p-8 md:p-12 border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="space-y-4 max-w-xl">
          <div class="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest">
            <span class="material-symbols-outlined text-base">store</span>
            Visit Store in Raebareli
          </div>
          <h3 class="font-display-lg text-2xl font-bold text-primary">
            Quality Glass Emporium And Photo Framing Center
          </h3>
          <p class="text-sm text-subtle-gray leading-relaxed">
            Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh. Stop by our workshop for custom glass edge polishing, mirror beveling, and instant framing services.
          </p>
          <div class="flex items-center gap-4 text-xs font-semibold text-primary pt-2">
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-amber-500">star</span> 4.9 Rating (8 Reviews)</span>
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-emerald-600">schedule</span> Open until 9:00 PM</span>
          </div>
        </div>

        <div class="shrink-0 space-y-3 text-center">
          <a href="tel:+919999535535" class="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm block hover:bg-primary-container transition-colors shadow-md">
            Call Store: +91-9999535535
          </a>
          <div class="text-xs text-subtle-gray">WhatsApp & Direct Inquiries</div>
        </div>
      </section>
    </div>
  `;
};

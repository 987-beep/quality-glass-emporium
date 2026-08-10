/* ============================================================
   QUALITY GLASS EMPORIUM - PRODUCT CARD COMPONENT
   ============================================================ */

window.renderProductCard = function(product) {
  const hasSale = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasSale ? product.salePrice : product.price;

  return `
    <div class="bg-white dark:bg-charcoal-bg rounded-xl border border-outline-variant/30 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <!-- Product Image -->
      <div class="aspect-square bg-surface-container-low relative overflow-hidden" onclick="window.appStore.navigateTo('product-detail', { id: '${product.id}' })">
        <img class="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" src="${product.imageUrl}" alt="${product.name}">
        ${hasSale ? `
          <span class="absolute top-3 left-3 bg-red-600 text-white font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
            SALE
          </span>
        ` : ''}
        ${product.isFeatured ? `
          <span class="absolute top-3 right-3 bg-tertiary-gold text-white font-bold text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            Featured
          </span>
        ` : ''}
      </div>

      <!-- Content -->
      <div class="p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <div class="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">
            ${product.categoryName || 'Frame & Glass'}
          </div>
          <h3 onclick="window.appStore.navigateTo('product-detail', { id: '${product.id}' })" class="font-headline-md text-base font-bold text-primary dark:text-white line-clamp-1 hover:text-secondary transition-colors">
            ${product.name}
          </h3>
          <p class="text-xs text-subtle-gray line-clamp-2 mt-1">
            ${product.description}
          </p>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <div class="flex items-baseline gap-2">
              <span class="font-bold text-lg text-primary dark:text-white">
                $${displayPrice.toFixed(2)}
              </span>
              ${hasSale ? `
                <span class="text-xs text-gray-400 line-through">
                  $${product.price.toFixed(2)}
                </span>
              ` : ''}
            </div>
            <div class="text-[11px] text-amber-500 font-medium flex items-center gap-1 mt-0.5">
              <span class="material-symbols-outlined text-xs">star</span>
              ${product.rating || '4.9'} (${product.reviewsCount || 5})
            </div>
          </div>

          <button onclick="window.appStore.addToCart(window.SEED_DATA.products.find(p => p.id === '${product.id}') || ${JSON.stringify(product).replace(/"/g, '&quot;')})" class="bg-secondary text-white p-2.5 rounded-lg hover:bg-secondary/90 active:scale-95 transition-all shadow-sm flex items-center justify-center" title="Add to Cart">
            <span class="material-symbols-outlined text-xl">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  `;
};

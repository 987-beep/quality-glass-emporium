/* ============================================================
   QUALITY GLASS EMPORIUM - PRODUCT DETAIL VIEW
   ============================================================ */

window.renderProductDetailView = function() {
  const store = window.appStore;
  const productId = store.viewParams.id || 'prod-1';
  const product = window.SEED_DATA.products.find(p => p.id === productId) || window.SEED_DATA.products[0];
  const reviews = window.SEED_DATA.reviews.filter(r => r.productId === product.id);

  const hasSale = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasSale ? product.salePrice : product.price;

  window.submitProductReview = function(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.customerName.value;
    const rating = parseInt(form.rating.value);
    const comment = form.comment.value;

    const newRev = {
      id: 'rev-' + Date.now(),
      productId: product.id,
      customerName: name,
      rating: rating,
      comment: comment,
      status: 'approved',
      createdAt: new Date().toISOString().split('T')[0]
    };

    window.SEED_DATA.reviews.unshift(newRev);
    window.appStore.showToast('Thank you! Your product review has been published.', 'success');
    window.appStore.notify();
  };

  return `
    <div class="space-y-12 animate-fade-in">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-subtle-gray">
        <span class="hover:text-primary cursor-pointer" onclick="window.appStore.navigateTo('home')">Home</span>
        <span>/</span>
        <span class="hover:text-primary cursor-pointer" onclick="window.appStore.navigateTo('catalog')">Collections</span>
        <span>/</span>
        <span class="font-bold text-primary dark:text-white">${product.name}</span>
      </div>

      <!-- Main Product Display (Stitch product_detail design) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white dark:bg-charcoal-bg rounded-2xl border border-outline-variant/30 p-6 md:p-10 shadow-lg">
        <!-- Gallery (6 cols) -->
        <div class="lg:col-span-6 space-y-4">
          <div class="aspect-square rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/30 relative shadow-inner">
            <img id="main-product-img" src="${product.imageUrl}" alt="${product.name}" class="w-full h-full object-cover">
          </div>
          ${product.galleryUrls && product.galleryUrls.length > 0 ? `
            <div class="flex gap-3 overflow-x-auto">
              <img src="${product.imageUrl}" onclick="document.getElementById('main-product-img').src = this.src" class="w-20 h-20 rounded-lg object-cover cursor-pointer border-2 border-secondary">
              ${product.galleryUrls.map(url => `
                <img src="${url}" onclick="document.getElementById('main-product-img').src = this.src" class="w-20 h-20 rounded-lg object-cover cursor-pointer border border-gray-200 hover:border-secondary transition-all">
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Product Specs & Buying Options (6 cols) -->
        <div class="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="bg-blue-100 text-secondary text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                ${product.categoryName || 'Frame & Glass'}
              </span>
              <span class="text-xs text-subtle-gray font-mono">SKU: ${product.sku || 'QGE-001'}</span>
            </div>

            <h1 class="font-display-lg text-2xl md:text-4xl font-extrabold text-primary dark:text-white">
              ${product.name}
            </h1>

            <div class="flex items-center gap-3">
              <div class="flex items-center text-amber-500 text-sm font-bold">
                <span class="material-symbols-outlined text-base">star</span>
                ${product.rating || '4.9'}
              </div>
              <span class="text-xs text-subtle-gray">(${product.reviewsCount || reviews.length} customer reviews)</span>
              <span class="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-600"></span> In Stock (${product.inventoryCount || 30} units)
              </span>
            </div>

            <div class="flex items-baseline gap-3 pt-2">
              <span class="text-3xl font-extrabold text-primary dark:text-white">
                $${displayPrice.toFixed(2)}
              </span>
              ${hasSale ? `
                <span class="text-lg text-gray-400 line-through">
                  $${product.price.toFixed(2)}
                </span>
                <span class="text-xs text-red-600 font-bold">
                  Save ${(100 - (displayPrice / product.price * 100)).toFixed(0)}%
                </span>
              ` : ''}
            </div>

            <p class="text-sm text-subtle-gray leading-relaxed pt-2 border-t border-gray-100 dark:border-gray-800">
              ${product.description}
            </p>

            <!-- Attributes / Materials Chips -->
            ${product.attributes ? `
              <div class="space-y-2 pt-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-primary dark:text-gray-300">
                  Specification Details
                </label>
                <div class="flex flex-wrap gap-2">
                  ${Object.entries(product.attributes).map(([k, v]) => `
                    <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-md font-medium border border-gray-200">
                      <strong>${k}:</strong> ${Array.isArray(v) ? v.join(', ') : v}
                    </span>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Add to Cart Action -->
          <div class="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button onclick="const el = document.getElementById('pd-qty'); el.value = Math.max(1, parseInt(el.value) - 1);" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">-</button>
                <input id="pd-qty" type="number" value="1" min="1" class="w-12 text-center py-2 text-sm font-bold border-none outline-none">
                <button onclick="const el = document.getElementById('pd-qty'); el.value = parseInt(el.value) + 1;" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">+</button>
              </div>

              <button onclick="const qty = parseInt(document.getElementById('pd-qty').value); window.appStore.addToCart(window.SEED_DATA.products.find(p => p.id === '${product.id}'), qty);" class="flex-1 bg-secondary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-secondary/90 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-lg">add_shopping_cart</span>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Reviews Section -->
      <section class="bg-white dark:bg-charcoal-bg rounded-2xl border border-outline-variant/30 p-6 md:p-10 space-y-8">
        <h2 class="font-display-lg text-2xl font-bold text-primary dark:text-white">
          Customer Reviews (${reviews.length})
        </h2>

        <!-- Reviews List -->
        <div class="space-y-4">
          ${reviews.map(r => `
            <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <div class="flex justify-between items-center">
                <div class="font-bold text-sm text-primary dark:text-white">${r.customerName}</div>
                <div class="text-xs text-amber-500 font-bold flex items-center">
                  ${'★'.repeat(r.rating)}
                </div>
              </div>
              <p class="text-xs text-subtle-gray">${r.comment}</p>
              <div class="text-[10px] text-gray-400">${r.createdAt}</div>
            </div>
          `).join('')}
        </div>

        <!-- Add Review Form -->
        <form onsubmit="window.submitProductReview(event)" class="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 class="font-bold text-sm text-primary dark:text-white">Write a Product Review</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="customerName" required placeholder="Your Name" class="p-2.5 text-xs rounded-lg border border-gray-300">
            <select name="rating" required class="p-2.5 text-xs rounded-lg border border-gray-300 font-bold">
              <option value="5">5 Stars - Excellent</option>
              <option value="4">4 Stars - Very Good</option>
              <option value="3">3 Stars - Average</option>
            </select>
          </div>
          <textarea name="comment" required placeholder="Share your experience with this frame or glass product..." rows="3" class="w-full p-2.5 text-xs rounded-lg border border-gray-300"></textarea>
          <button type="submit" class="bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-primary-container">
            Submit Review
          </button>
        </form>
      </section>
    </div>
  `;
};

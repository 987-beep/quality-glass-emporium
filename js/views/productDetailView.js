/* ========================================================
   QUALITY GLASS EMPORIUM - PRODUCT DETAIL VIEW
   ======================================================== */

window.ProductDetailView = {
  render(productId) {
    const products = window.Store.getItem(window.Store.STORAGE_KEYS.PRODUCTS, []);
    const product = products.find(p => p.id === productId) || products[0];

    if (!product) {
      return `<div class="py-12 text-center font-headline-md">Product Not Found. <button onclick="window.App.navigate('home')" class="btn btn-primary mt-4">Back to Shop</button></div>`;
    }

    const categories = window.Store.getItem(window.Store.STORAGE_KEYS.CATEGORIES, []);
    const category = categories.find(c => c.id === product.category_id) || { name: "Framing & Glass" };
    const images = product.images && product.images.length > 0 ? product.images : ["https://via.placeholder.com/600?text=Quality+Glass"];

    return `
      <div class="space-y-8">
        <!-- Breadcrumb Navigation -->
        <nav class="flex items-center gap-2 text-xs text-on-surface-variant">
          <a href="#" onclick="window.App.navigate('home')" class="hover:text-secondary">Home</a>
          <span>/</span>
          <span>${category.name}</span>
          <span>/</span>
          <span class="text-on-surface font-medium">${product.name}</span>
        </nav>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <!-- Gallery Image Section -->
          <div class="space-y-4">
            <div class="aspect-square rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/30 shadow-md">
              <img id="main-product-image" src="${images[0]}" alt="${product.name}" class="w-full h-full object-cover">
            </div>
            ${images.length > 1 ? `
              <div class="flex gap-3 overflow-x-auto pb-2">
                ${images.map((img, i) => `
                  <img src="${img}" onclick="document.getElementById('main-product-image').src='${img}'" class="w-20 h-20 rounded-lg object-cover cursor-pointer border-2 border-transparent hover:border-secondary transition-all">
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Specifications & Purchase Panel -->
          <div class="space-y-6">
            <div>
              <span class="badge badge-gold mb-2">${category.name}</span>
              <h1 class="font-headline-lg text-primary dark:text-primary-fixed text-3xl font-bold">${product.name}</h1>
              <p class="text-xs text-on-surface-variant mt-1">SKU: <span class="font-semibold">${product.sku}</span> | In Stock: <span class="text-success font-semibold">${product.stock_quantity} units</span></p>
            </div>

            <!-- Price Container -->
            <div class="flex items-baseline gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span class="text-3xl font-bold text-primary dark:text-primary-fixed">$${(product.sale_price || product.price).toFixed(2)}</span>
              ${product.sale_price ? `<span class="text-lg text-on-surface-variant line-through">$${product.price.toFixed(2)}</span>` : ''}
              <span class="text-xs text-success-green font-semibold ml-auto flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">verified</span> Direct Raebareli Workshop Price
              </span>
            </div>

            <!-- Description -->
            <div>
              <h3 class="font-label-md text-on-surface font-bold mb-2">Description & Craftsmanship</h3>
              <p class="font-body-md text-on-surface-variant leading-relaxed">${product.description}</p>
            </div>

            <!-- Quantity & Add to Cart Controls -->
            <div class="space-y-4 pt-4 border-t border-outline-variant/30">
              <div class="flex items-center gap-4">
                <div class="flex items-center border border-outline-variant rounded-lg bg-surface">
                  <button onclick="window.ProductDetailView.updateQty(-1)" class="px-3 py-2 text-lg hover:bg-surface-container-high">-</button>
                  <input type="number" id="detail-qty-input" value="1" min="1" max="${product.stock_quantity}" class="w-12 text-center font-semibold outline-none bg-transparent">
                  <button onclick="window.ProductDetailView.updateQty(1)" class="px-3 py-2 text-lg hover:bg-surface-container-high">+</button>
                </div>
                <button onclick="window.ProductDetailView.addToCart('${product.id}')" class="btn btn-primary flex-1 py-3 text-base">
                  <span class="material-symbols-outlined">add_shopping_cart</span> Add to Shopping Cart
                </button>
              </div>
            </div>

            <!-- Quality Guarantee Badge -->
            <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary text-3xl">verified_user</span>
              <div class="text-xs text-on-surface-variant">
                <strong class="text-on-surface block font-semibold">100% Quality Glass Guarantee</strong>
                Shipped with safe shatterproof packaging. Insured delivery from Raebareli shop.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  updateQty(delta) {
    const input = document.getElementById("detail-qty-input");
    if (input) {
      let val = parseInt(input.value) || 1;
      val = Math.max(1, val + delta);
      input.value = val;
    }
  },

  addToCart(productId) {
    const input = document.getElementById("detail-qty-input");
    const qty = input ? parseInt(input.value) || 1 : 1;
    window.Store.addToCart(productId, qty);
    alert("Product added to cart!");
  }
};

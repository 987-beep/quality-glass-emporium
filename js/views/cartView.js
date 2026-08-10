/* ========================================================
   QUALITY GLASS EMPORIUM - SHOPPING CART VIEW
   ======================================================== */

window.CartView = {
  appliedCoupon: null,

  render() {
    const cart = window.Store.getCart();
    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});

    if (cart.length === 0) {
      return `
        <div class="max-w-xl mx-auto py-16 text-center space-y-6">
          <span class="material-symbols-outlined text-6xl text-outline">shopping_cart</span>
          <h2 class="font-headline-lg text-primary dark:text-primary-fixed">Your Shopping Cart is Empty</h2>
          <p class="font-body-md text-on-surface-variant">Explore our custom frames, museum glass, and acrylic collections to get started.</p>
          <button onclick="window.App.navigate('home')" class="btn btn-primary">
            <span class="material-symbols-outlined">storefront</span> Browse Collections
          </button>
        </div>
      `;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = this.appliedCoupon ? (this.appliedCoupon.discount_type === 'percentage' ? (subtotal * this.appliedCoupon.discount_value / 100) : this.appliedCoupon.discount_value) : 0;
    const shipping = subtotal >= (settings.free_shipping_min || 150) ? 0 : (settings.shipping_fee || 15);
    const tax = ((subtotal - discount) * ((settings.tax_rate || 18) / 100));
    const total = Math.max(0, subtotal - discount + shipping + tax);

    return `
      <div class="space-y-8">
        <h1 class="font-headline-lg text-primary dark:text-primary-fixed">Shopping Cart</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <!-- Cart Items List -->
          <div class="lg:col-span-2 space-y-4">
            ${cart.map(item => `
              <div class="p-4 rounded-xl bg-surface border border-outline-variant/30 flex items-center gap-4 shadow-sm">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-lg object-cover bg-surface-container-low">
                <div class="flex-1 min-w-0">
                  <h3 class="font-headline-md text-base text-on-surface font-semibold truncate">${item.name}</h3>
                  <p class="text-xs text-on-surface-variant">SKU: ${item.sku}</p>
                  <p class="text-sm font-bold text-primary dark:text-primary-fixed mt-1">$${item.price.toFixed(2)} each</p>
                </div>

                <!-- Quantity controls -->
                <div class="flex items-center border border-outline-variant rounded-lg bg-surface">
                  <button onclick="window.Store.updateCartQuantity('${item.product_id}', ${item.quantity - 1})" class="px-2 py-1 hover:bg-surface-container-high text-sm">-</button>
                  <span class="px-3 text-sm font-semibold">${item.quantity}</span>
                  <button onclick="window.Store.updateCartQuantity('${item.product_id}', ${item.quantity + 1})" class="px-2 py-1 hover:bg-surface-container-high text-sm">+</button>
                </div>

                <div class="text-right min-w-[80px]">
                  <div class="font-bold text-base text-primary dark:text-primary-fixed">$${(item.price * item.quantity).toFixed(2)}</div>
                  <button onclick="window.Store.removeFromCart('${item.product_id}')" class="text-xs text-error hover:underline mt-1 flex items-center justify-end gap-1 ml-auto">
                    <span class="material-symbols-outlined text-xs">delete</span> Remove
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Order Summary Card -->
          <div class="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-sm">
            <h2 class="font-headline-md text-primary dark:text-primary-fixed text-xl font-bold">Order Summary</h2>

            <!-- Coupon Box -->
            <div class="space-y-2">
              <label class="text-xs font-semibold text-on-surface-variant">Coupon or Discount Code</label>
              <div class="flex gap-2">
                <input type="text" id="coupon-code-input" placeholder="e.g. WELCOME10" class="input-field py-2 text-sm uppercase">
                <button onclick="window.CartView.applyCoupon()" class="btn btn-secondary text-xs px-3">Apply</button>
              </div>
              ${this.appliedCoupon ? `<p class="text-xs text-success font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-xs">check_circle</span> Coupon '${this.appliedCoupon.code}' applied!</p>` : ''}
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
              <div class="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span class="font-semibold text-on-surface">$${subtotal.toFixed(2)}</span>
              </div>
              ${discount > 0 ? `
                <div class="flex justify-between text-success font-semibold">
                  <span>Discount</span>
                  <span>-$${discount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="flex justify-between text-on-surface-variant">
                <span>Estimated Shipping</span>
                <span class="font-semibold text-on-surface">${shipping === 0 ? '<span class="text-success font-bold">FREE</span>' : '$' + shipping.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Tax (${settings.tax_rate || 18}%)</span>
                <span class="font-semibold text-on-surface">$${tax.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-primary dark:text-primary-fixed pt-3 border-t border-outline-variant/30">
                <span>Total Amount</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>

            <button onclick="window.App.navigate('checkout')" class="btn btn-primary w-full py-3.5 text-base">
              Proceed to Checkout <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  applyCoupon() {
    const input = document.getElementById("coupon-code-input");
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    const coupons = window.Store.getItem(window.Store.STORAGE_KEYS.COUPONS, []);
    const found = coupons.find(c => c.code.toUpperCase() === code && c.is_active);

    if (found) {
      this.appliedCoupon = found;
      alert(`Coupon '${found.code}' applied successfully!`);
      window.App.renderCurrentView();
    } else {
      alert("Invalid or expired coupon code.");
    }
  }
};

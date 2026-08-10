/* ============================================================
   QUALITY GLASS EMPORIUM - SHOPPING CART VIEW
   ============================================================ */

window.renderCartView = function() {
  const store = window.appStore;
  const cart = store.cart;
  const subtotal = store.getCartSubtotal();
  const discount = store.getDiscountAmount();
  const shipping = store.getShippingAmount();
  const tax = store.getTaxAmount();
  const total = store.getCartTotal();

  if (cart.length === 0) {
    return `
      <div class="max-w-2xl mx-auto text-center py-20 bg-white dark:bg-charcoal-bg rounded-2xl border border-outline-variant/30 space-y-6 shadow-sm animate-fade-in">
        <span class="material-symbols-outlined text-6xl text-gray-300">shopping_bag</span>
        <h2 class="font-display-lg text-2xl font-bold text-primary dark:text-white">Your Shopping Cart is Empty</h2>
        <p class="text-sm text-subtle-gray">Explore our handcrafted photo frames, floating acrylic glass, and custom mirrors.</p>
        <button onclick="window.appStore.navigateTo('catalog')" class="bg-secondary text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-secondary/90">
          Browse Collections
        </button>
      </div>
    `;
  }

  return `
    <div class="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div class="flex justify-between items-center">
        <h1 class="font-display-lg text-2xl md:text-3xl font-bold text-primary dark:text-white">
          Shopping Cart (${store.getCartCount()} items)
        </h1>
        <button onclick="window.appStore.clearCart()" class="text-xs text-error hover:underline font-medium">
          Clear Entire Cart
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Cart Items List (8 cols) -->
        <div class="lg:col-span-8 space-y-4">
          ${cart.map(item => {
            const p = item.product;
            const price = p.salePrice || p.price;
            return `
              <div class="bg-white dark:bg-charcoal-bg rounded-xl border border-outline-variant/30 p-4 flex gap-4 items-center shadow-sm">
                <img src="${p.imageUrl}" alt="${p.name}" class="w-20 h-20 rounded-lg object-cover shrink-0">
                <div class="flex-1 space-y-1">
                  <h3 class="font-bold text-sm text-primary dark:text-white">${p.name}</h3>
                  <div class="text-xs text-subtle-gray font-mono">$${price.toFixed(2)} each</div>
                  ${item.options && Object.keys(item.options).length > 0 ? `
                    <div class="text-[11px] text-gray-500 font-mono">Custom: ${JSON.stringify(item.options)}</div>
                  ` : ''}
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center border border-gray-200 rounded-lg">
                  <button onclick="window.appStore.updateCartQuantity('${item.id}', ${item.quantity - 1})" class="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100">-</button>
                  <span class="px-3 text-xs font-bold">${item.quantity}</span>
                  <button onclick="window.appStore.updateCartQuantity('${item.id}', ${item.quantity + 1})" class="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100">+</button>
                </div>

                <!-- Item Total -->
                <div class="text-right shrink-0">
                  <div class="font-bold text-sm text-primary dark:text-white">$${(price * item.quantity).toFixed(2)}</div>
                  <button onclick="window.appStore.removeFromCart('${item.id}')" class="text-[11px] text-red-500 hover:underline">Remove</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Order Summary & Checkout Box (4 cols) -->
        <div class="lg:col-span-4 bg-white dark:bg-charcoal-bg rounded-2xl border border-outline-variant/30 p-6 space-y-6 shadow-lg h-fit">
          <h2 class="font-bold text-lg text-primary dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
            Order Summary
          </h2>

          <!-- Coupon Form -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-subtle-gray">Promo / Coupon Code</label>
            <div class="flex gap-2">
              <input id="coupon-input" type="text" placeholder="e.g. GLASS10" class="w-full p-2 text-xs uppercase rounded-lg border border-gray-300">
              <button onclick="const val = document.getElementById('coupon-input').value; window.appStore.applyCoupon(val);" class="bg-primary text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-primary-container">
                Apply
              </button>
            </div>
            ${store.appliedCoupon ? `
              <div class="text-xs text-emerald-600 font-bold flex justify-between items-center bg-emerald-50 p-2 rounded">
                <span>Coupon '${store.appliedCoupon.code}' Applied</span>
                <button onclick="window.appStore.removeCoupon()" class="text-red-500 font-normal">Remove</button>
              </div>
            ` : ''}
          </div>

          <!-- Price Breakdown -->
          <div class="space-y-2 text-xs text-subtle-gray pt-3 border-t border-gray-100 dark:border-gray-800">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-bold text-primary dark:text-white">$${subtotal.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
              <div class="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-$${discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="flex justify-between">
              <span>Shipping Fee</span>
              <span>${shipping === 0 ? '<strong class="text-emerald-600">FREE</strong>' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span>Estimated Tax (5%)</span>
              <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-base font-extrabold text-primary dark:text-white pt-3 border-t border-gray-200">
              <span>Total Amount</span>
              <span class="text-secondary">$${total.toFixed(2)}</span>
            </div>
          </div>

          <button onclick="window.appStore.navigateTo('checkout')" class="w-full bg-secondary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-secondary/90 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
            <span>Proceed to Checkout</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  `;
};

/* ============================================================
   QUALITY GLASS EMPORIUM - CHECKOUT & PAYMENT PROOF UPLOAD VIEW
   ============================================================ */

window.renderCheckoutView = function() {
  const store = window.appStore;
  const cart = store.cart;
  const user = store.currentUser;
  
  if (cart.length === 0) {
    store.navigateTo('cart');
    return '';
  }

  const subtotal = store.getCartSubtotal();
  const discount = store.getDiscountAmount();
  const shipping = store.getShippingAmount();
  const tax = store.getTaxAmount();
  const total = store.getCartTotal();

  if (!window._checkoutFormState) {
    window._checkoutFormState = {
      customerName: user ? user.name : '',
      customerEmail: user ? user.email : '',
      customerPhone: '',
      shippingAddress: 'PNT Colony, Raebareli-229001, Uttar Pradesh',
      paymentMethod: 'upi',
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      proofFileName: 'sample_payment_receipt.png'
    };
  }

  const formState = window._checkoutFormState;

  window.handlePaymentProofFile = function(input) {
    const file = input.files[0];
    if (file) {
      window._checkoutFormState.proofFileName = file.name;
      const reader = new FileReader();
      reader.onload = function(e) {
        window._checkoutFormState.proofUrl = e.target.result;
        window.appStore.notify();
      };
      reader.readAsDataURL(file);
    }
  };

  window.submitOrderAndPaymentProof = async function(e) {
    e.preventDefault();
    const f = window._checkoutFormState;
    
    if (!f.proofUrl) {
      window.appStore.showToast('Please upload payment receipt proof photo.', 'error');
      return;
    }

    const orderPayload = {
      customerName: f.customerName,
      customerEmail: f.customerEmail,
      customerPhone: f.customerPhone,
      shippingAddress: f.shippingAddress,
      paymentMethod: f.paymentMethod,
      proofUrl: f.proofUrl,
      subtotal,
      shippingAmount: shipping,
      taxAmount: tax,
      discountAmount: discount,
      totalAmount: total,
      couponCode: store.appliedCoupon ? store.appliedCoupon.code : null,
      items: cart.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.salePrice || i.product.price,
        quantity: i.quantity,
        total: (i.product.salePrice || i.product.price) * i.quantity,
        options: i.options
      }))
    };

    // Save transaction to DB Engine
    const createdOrder = await window.dbEngine.createOrder(orderPayload);
    
    // Clear shopping cart
    store.clearCart();

    window.appStore.showToast(`Order #${createdOrder.orderNumber} placed! Payment proof sent for Admin approval.`, 'success');
    window.appStore.navigateTo('customer');
  };

  const gateways = window.SEED_DATA.paymentGateways;

  return `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div class="text-center space-y-2">
        <span class="text-xs font-bold text-secondary uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
          Checkout & Payment Proof
        </span>
        <h1 class="font-display-lg text-3xl font-extrabold text-primary dark:text-white">
          Complete Your Order
        </h1>
        <p class="text-xs text-subtle-gray">
          Quality Glass Emporium • Raebareli Workshop Direct
        </p>
      </div>

      <form onsubmit="window.submitOrderAndPaymentProof(event)" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Customer & Payment Proof Info (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Step 1: Customer Details -->
          <div class="bg-white dark:bg-charcoal-bg p-6 rounded-2xl border border-outline-variant/30 space-y-4 shadow-sm">
            <h2 class="font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
              Customer & Shipping Details
            </h2>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" required value="${formState.customerName}" onchange="window._checkoutFormState.customerName = this.value" class="w-full p-2.5 text-xs rounded-lg border border-gray-300">
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input type="email" required value="${formState.customerEmail}" onchange="window._checkoutFormState.customerEmail = this.value" class="w-full p-2.5 text-xs rounded-lg border border-gray-300">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input type="tel" required value="${formState.customerPhone}" placeholder="+91 9876543210" onchange="window._checkoutFormState.customerPhone = this.value" class="w-full p-2.5 text-xs rounded-lg border border-gray-300">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Delivery Address</label>
                <textarea required rows="2" onchange="window._checkoutFormState.shippingAddress = this.value" class="w-full p-2.5 text-xs rounded-lg border border-gray-300">${formState.shippingAddress}</textarea>
              </div>
            </div>
          </div>

          <!-- Step 2: Payment Method & Instructions -->
          <div class="bg-white dark:bg-charcoal-bg p-6 rounded-2xl border border-outline-variant/30 space-y-4 shadow-sm">
            <h2 class="font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
              Payment Method & Transfer
            </h2>

            <div class="grid grid-cols-3 gap-3">
              <button type="button" onclick="window._checkoutFormState.paymentMethod = 'upi'; window.appStore.notify();" class="p-3 rounded-xl border text-center font-bold text-xs ${formState.paymentMethod === 'upi' ? 'border-secondary bg-blue-50 text-secondary' : 'border-gray-200'}">
                UPI / QR Code
              </button>
              <button type="button" onclick="window._checkoutFormState.paymentMethod = 'bank_transfer'; window.appStore.notify();" class="p-3 rounded-xl border text-center font-bold text-xs ${formState.paymentMethod === 'bank_transfer' ? 'border-secondary bg-blue-50 text-secondary' : 'border-gray-200'}">
                Bank Transfer
              </button>
              <button type="button" onclick="window._checkoutFormState.paymentMethod = 'qr_code'; window.appStore.notify();" class="p-3 rounded-xl border text-center font-bold text-xs ${formState.paymentMethod === 'qr_code' ? 'border-secondary bg-blue-50 text-secondary' : 'border-gray-200'}">
                Store Payment
              </button>
            </div>

            <!-- Payment instructions box -->
            <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs space-y-2">
              ${formState.paymentMethod === 'upi' ? `
                <div class="flex items-center gap-4">
                  <img src="${gateways.upiDetails.qrCodeUrl}" alt="UPI QR" class="w-24 h-24 rounded border bg-white p-1">
                  <div>
                    <div class="font-bold text-primary dark:text-white">Pay via UPI ID:</div>
                    <div class="font-mono text-secondary text-sm font-bold">${gateways.upiDetails.upiId}</div>
                    <div class="text-subtle-gray text-[11px] mt-1">Scan QR code or copy UPI ID to complete total payment of <strong>$${total.toFixed(2)}</strong>.</div>
                  </div>
                </div>
              ` : `
                <div class="space-y-1 font-mono">
                  <div>Bank: <strong>${gateways.bankDetails.bankName}</strong></div>
                  <div>Account Name: <strong>${gateways.bankDetails.accountName}</strong></div>
                  <div>Account No: <strong>${gateways.bankDetails.accountNumber}</strong></div>
                  <div>IFSC: <strong>${gateways.bankDetails.ifscCode}</strong></div>
                </div>
              `}
            </div>
          </div>

          <!-- Step 3: Payment Proof File Upload Dropzone (Stitch checkout_payment_proof design) -->
          <div class="bg-white dark:bg-charcoal-bg p-6 rounded-2xl border border-outline-variant/30 space-y-4 shadow-sm">
            <h2 class="font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
              Upload Payment Proof Receipt
            </h2>

            <div class="border-2 border-dashed border-secondary/40 hover:border-secondary bg-blue-50/50 rounded-2xl p-6 text-center space-y-3 relative cursor-pointer">
              <input type="file" accept="image/*,.pdf" onchange="window.handlePaymentProofFile(this)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
              <span class="material-symbols-outlined text-4xl text-secondary">cloud_upload</span>
              <div>
                <div class="font-bold text-sm text-primary dark:text-white">Click or Drag Payment Proof Photo</div>
                <div class="text-xs text-subtle-gray">Upload bank screenshot, UPI transaction receipt, or payment voucher</div>
              </div>
              ${formState.proofFileName ? `
                <div class="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-secondary text-xs font-bold text-secondary shadow-sm">
                  <span class="material-symbols-outlined text-sm">check_circle</span>
                  <span>${formState.proofFileName}</span>
                </div>
              ` : ''}
            </div>

            ${formState.proofUrl ? `
              <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                <img src="${formState.proofUrl}" alt="Proof Preview" class="w-16 h-16 rounded object-cover border">
                <div class="text-xs">
                  <div class="font-bold text-emerald-600 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">verified</span> Proof Attached
                  </div>
                  <div class="text-subtle-gray">Ready for admin payment review</div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Order Summary Column (5 cols) -->
        <div class="lg:col-span-5 bg-white dark:bg-charcoal-bg p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-lg h-fit">
          <h2 class="font-bold text-base text-primary dark:text-white pb-3 border-b border-gray-100">
            Order Review (${cart.length} Items)
          </h2>

          <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
            ${cart.map(i => `
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <img src="${i.product.imageUrl}" class="w-10 h-10 rounded object-cover">
                  <div>
                    <div class="font-bold text-primary dark:text-white">${i.product.name}</div>
                    <div class="text-subtle-gray">Qty: ${i.quantity}</div>
                  </div>
                </div>
                <div class="font-bold">$${((i.product.salePrice || i.product.price) * i.quantity).toFixed(2)}</div>
              </div>
            `).join('')}
          </div>

          <div class="space-y-2 text-xs text-subtle-gray pt-4 border-t border-gray-100">
            <div class="flex justify-between"><span>Subtotal</span><span class="font-bold text-primary">$${subtotal.toFixed(2)}</span></div>
            ${discount > 0 ? `<div class="flex justify-between text-emerald-600 font-bold"><span>Discount</span><span>-$${discount.toFixed(2)}</span></div>` : ''}
            <div class="flex justify-between"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Estimated Tax</span><span>$${tax.toFixed(2)}</span></div>
            <div class="flex justify-between text-lg font-extrabold text-primary pt-3 border-t border-gray-200">
              <span>Total Due</span>
              <span class="text-secondary">$${total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" class="w-full bg-secondary text-white py-4 rounded-xl font-bold text-sm hover:bg-secondary/90 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            Submit Order & Payment Proof
          </button>
        </div>
      </form>
    </div>
  `;
};

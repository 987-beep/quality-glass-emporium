/* ========================================================
   QUALITY GLASS EMPORIUM - CHECKOUT & PAYMENT PROOF VIEW
   ======================================================== */

window.CheckoutView = {
  uploadedProofUrl: null,

  render() {
    const cart = window.Store.getCart();
    if (cart.length === 0) {
      window.App.navigate('cart');
      return '';
    }

    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});
    const user = window.Auth.getCurrentUser();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= (settings.free_shipping_min || 150) ? 0 : (settings.shipping_fee || 15);
    const tax = subtotal * ((settings.tax_rate || 18) / 100);
    const total = subtotal + shipping + tax;

    return `
      <div class="space-y-8 max-w-4xl mx-auto">
        <h1 class="font-headline-lg text-primary dark:text-primary-fixed">Checkout & Payment Approval</h1>

        <form id="checkout-form" onsubmit="window.CheckoutView.submitOrder(event)" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <!-- Shipping & Customer Details -->
          <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 shadow-sm">
            <h2 class="font-headline-md text-lg text-primary dark:text-primary-fixed font-bold border-b border-outline-variant/20 pb-3">
              1. Customer & Shipping Details
            </h2>

            <div class="space-y-3">
              <div>
                <label class="text-xs font-semibold text-on-surface-variant block mb-1">Full Name</label>
                <input type="text" id="cust-name" required value="${user ? user.displayName : ''}" class="input-field py-2 text-sm" placeholder="John Doe">
              </div>

              <div>
                <label class="text-xs font-semibold text-on-surface-variant block mb-1">Email Address</label>
                <input type="email" id="cust-email" required value="${user ? user.email : ''}" class="input-field py-2 text-sm" placeholder="john@example.com">
              </div>

              <div>
                <label class="text-xs font-semibold text-on-surface-variant block mb-1">Phone Number</label>
                <input type="tel" id="cust-phone" required class="input-field py-2 text-sm" placeholder="+91 98765 43210">
              </div>

              <div>
                <label class="text-xs font-semibold text-on-surface-variant block mb-1">Street Address / Landmark</label>
                <input type="text" id="cust-street" required class="input-field py-2 text-sm" placeholder="House/Flat No, Street, Landmark">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-on-surface-variant block mb-1">City</label>
                  <input type="text" id="cust-city" required value="Raebareli" class="input-field py-2 text-sm">
                </div>
                <div>
                  <label class="text-xs font-semibold text-on-surface-variant block mb-1">PIN Code</label>
                  <input type="text" id="cust-pin" required value="229001" class="input-field py-2 text-sm">
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Proof Upload & Order Total -->
          <div class="space-y-6">
            <!-- Payment Instructions Card -->
            <div class="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-sm">
              <h2 class="font-headline-md text-lg text-primary dark:text-primary-fixed font-bold border-b border-outline-variant/20 pb-3">
                2. Payment & Proof Upload
              </h2>

              <div class="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <span class="badge badge-gold">Official Store UPI / Bank Details</span>
                <p class="text-xs text-on-surface font-semibold">Bank Name: State Bank of India (Raebareli Main)</p>
                <p class="text-xs text-on-surface">Account Name: Quality Glass Emporium</p>
                <p class="text-xs text-on-surface font-mono">A/C No: 39847502948 | IFSC: SBIN0001234</p>
                <p class="text-xs text-secondary font-mono">UPI ID: qualityglass@sbi</p>
              </div>

              <!-- Transaction ID -->
              <div>
                <label class="text-xs font-semibold text-on-surface-variant block mb-1">Transaction Ref / UTR Number *</label>
                <input type="text" id="cust-tx-id" required class="input-field py-2 text-sm font-mono" placeholder="e.g. 429810485710">
              </div>

              <!-- Payment Proof Screenshot File Upload -->
              <div>
                <label class="text-xs font-semibold text-on-surface-variant block mb-1">Upload Payment Screenshot / Receipt Proof *</label>
                <input type="file" id="cust-proof-file" accept="image/*" onchange="window.CheckoutView.handleFileSelect(event)" class="input-field py-2 text-xs">
                <div id="proof-preview-container" class="mt-3 hidden">
                  <p class="text-xs text-success font-semibold mb-1">Receipt Screenshot Selected:</p>
                  <img id="proof-preview-img" src="" class="w-full h-32 object-cover rounded-lg border border-outline-variant">
                </div>
              </div>
            </div>

            <!-- Total Breakdown Card -->
            <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 shadow-sm">
              <div class="space-y-2 text-xs text-on-surface-variant border-b border-outline-variant/20 pb-3">
                <div class="flex justify-between"><span>Subtotal (${cart.length} items)</span><span>$${subtotal.toFixed(2)}</span></div>
                <div class="flex justify-between"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span></div>
                <div class="flex justify-between"><span>Tax</span><span>$${tax.toFixed(2)}</span></div>
              </div>
              <div class="flex justify-between text-lg font-bold text-primary dark:text-primary-fixed">
                <span>Total Payable</span>
                <span>$${total.toFixed(2)}</span>
              </div>

              <button type="submit" class="btn btn-primary w-full py-3.5 text-base">
                <span class="material-symbols-outlined">verified</span> Submit Order for Payment Approval
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedProofUrl = e.target.result;
        const container = document.getElementById("proof-preview-container");
        const img = document.getElementById("proof-preview-img");
        if (container && img) {
          img.src = this.uploadedProofUrl;
          container.classList.remove("hidden");
        }
      };
      reader.readAsDataURL(file);
    }
  },

  submitOrder(event) {
    event.preventDefault();

    const txId = document.getElementById("cust-tx-id").value.trim();
    if (!txId) {
      alert("Please enter your Transaction Ref / UTR Number.");
      return;
    }

    if (!this.uploadedProofUrl) {
      // Create fallback placeholder proof if user selected default file without previewing
      this.uploadedProofUrl = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80";
    }

    const cart = window.Store.getCart();
    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});
    const user = window.Auth.getCurrentUser();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= (settings.free_shipping_min || 150) ? 0 : (settings.shipping_fee || 15);
    const tax = subtotal * ((settings.tax_rate || 18) / 100);
    const total = subtotal + shipping + tax;

    const orderData = {
      user_id: user ? user.id : "guest",
      customer_name: document.getElementById("cust-name").value.trim(),
      customer_email: document.getElementById("cust-email").value.trim(),
      customer_phone: document.getElementById("cust-phone").value.trim(),
      shipping_address: {
        street: document.getElementById("cust-street").value.trim(),
        city: document.getElementById("cust-city").value.trim(),
        pin: document.getElementById("cust-pin").value.trim()
      },
      items: cart,
      subtotal: subtotal,
      shipping_fee: shipping,
      tax_amount: tax,
      total_amount: total,
      payment_method: "Bank Transfer / UPI",
      payment_proof: this.uploadedProofUrl,
      transaction_id: txId
    };

    const newOrder = window.Store.createOrder(orderData);
    alert(`Order ${newOrder.order_number} submitted successfully! Your payment proof is under review by Admin.`);
    
    if (user) {
      window.App.navigate('account-dashboard');
    } else {
      window.App.navigate('home');
    }
  }
};

/* ========================================================
   QUALITY GLASS EMPORIUM - ADMIN BRANDING & COUPONS VIEWS
   ======================================================== */

window.AdminBrandingView = {
  render() {
    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});

    const content = `
      <div class="space-y-8 max-w-3xl">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Store Branding & Business Info</h1>
          <p class="text-xs text-on-surface-variant">Update contact details, business location in Raebareli, hours, and store identity.</p>
        </div>

        <form id="branding-form" onsubmit="window.AdminBrandingView.saveSettings(event)" class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 text-xs shadow-sm">
          <div>
            <label class="font-semibold block mb-1">Official Business Name *</label>
            <input type="text" id="brand-name" required value="${settings.store_name || ''}" class="input-field py-2 text-xs">
          </div>

          <div>
            <label class="font-semibold block mb-1">Full Shop Address *</label>
            <input type="text" id="brand-address" required value="${settings.address || ''}" class="input-field py-2 text-xs">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-semibold block mb-1">Contact Phone *</label>
              <input type="text" id="brand-phone" required value="${settings.phone || ''}" class="input-field py-2 text-xs">
            </div>
            <div>
              <label class="font-semibold block mb-1">Support Email *</label>
              <input type="email" id="brand-email" required value="${settings.email || ''}" class="input-field py-2 text-xs">
            </div>
          </div>

          <div>
            <label class="font-semibold block mb-1">Operating Hours & Store Status</label>
            <input type="text" id="brand-hours" value="${settings.opening_hours || ''}" class="input-field py-2 text-xs">
          </div>

          <div class="pt-4 flex justify-end">
            <button type="submit" class="btn btn-primary text-xs">Save Store Branding Settings</button>
          </div>
        </form>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-branding");
  },

  saveSettings(event) {
    event.preventDefault();
    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});
    settings.store_name = document.getElementById("brand-name").value.trim();
    settings.address = document.getElementById("brand-address").value.trim();
    settings.phone = document.getElementById("brand-phone").value.trim();
    settings.email = document.getElementById("brand-email").value.trim();
    settings.opening_hours = document.getElementById("brand-hours").value.trim();

    window.Store.setItem(window.Store.STORAGE_KEYS.SETTINGS, settings);
    alert("Store Branding & Contact info updated successfully!");
    window.App.renderCurrentView();
  }
};

window.AdminCouponsView = {
  render() {
    const coupons = window.Store.getItem(window.Store.STORAGE_KEYS.COUPONS, []);

    const content = `
      <div class="space-y-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="font-headline-lg text-primary text-2xl font-bold">Coupons & Discounts Manager</h1>
            <p class="text-xs text-on-surface-variant">Create and manage promotional codes for customer checkout.</p>
          </div>
          <button onclick="window.AdminCouponsView.addCoupon()" class="btn btn-primary text-xs">
            <span class="material-symbols-outlined text-sm">local_offer</span> Create Coupon
          </button>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <table class="w-full text-left text-xs">
            <thead class="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
              <tr>
                <th class="p-3">Coupon Code</th>
                <th class="p-3">Discount Type</th>
                <th class="p-3">Value</th>
                <th class="p-3">Min Order</th>
                <th class="p-3">Status</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20">
              ${coupons.map(c => `
                <tr>
                  <td class="p-3 font-mono font-bold text-primary">${c.code}</td>
                  <td class="p-3 uppercase">${c.discount_type}</td>
                  <td class="p-3 font-bold">${c.discount_type === 'percentage' ? c.discount_value + '%' : '$' + c.discount_value}</td>
                  <td class="p-3 font-semibold">$${c.min_order}</td>
                  <td class="p-3"><span class="badge ${c.is_active ? 'badge-green' : 'badge-red'}">${c.is_active ? 'Active' : 'Disabled'}</span></td>
                  <td class="p-3">
                    <button onclick="window.AdminCouponsView.deleteCoupon('${c.id}')" class="text-error font-semibold hover:underline">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-coupons");
  },

  addCoupon() {
    const code = prompt("Enter Coupon Code (e.g. GLASS20):");
    if (!code) return;
    const val = parseFloat(prompt("Enter Discount Value (e.g. 20 for 20% or $20):"));
    if (!val) return;
    const coupons = window.Store.getItem(window.Store.STORAGE_KEYS.COUPONS, []);
    coupons.push({
      id: "cp_" + Date.now(),
      code: code.trim().toUpperCase(),
      discount_type: "percentage",
      discount_value: val,
      min_order: 50,
      is_active: true
    });
    window.Store.setItem(window.Store.STORAGE_KEYS.COUPONS, coupons);
    alert("Coupon created!");
    window.App.renderCurrentView();
  },

  deleteCoupon(couponId) {
    if (confirm("Delete coupon?")) {
      let coupons = window.Store.getItem(window.Store.STORAGE_KEYS.COUPONS, []);
      coupons = coupons.filter(c => c.id !== couponId);
      window.Store.setItem(window.Store.STORAGE_KEYS.COUPONS, coupons);
      window.App.renderCurrentView();
    }
  }
};

/* ========================================================
   QUALITY GLASS EMPORIUM - ADMIN SHIPPING & REVIEWS VIEWS
   ======================================================== */

window.AdminShippingView = {
  render() {
    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});

    const content = `
      <div class="space-y-8 max-w-3xl">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Shipping & Tax Rules</h1>
          <p class="text-xs text-on-surface-variant">Configure delivery fees, free shipping thresholds, and GST / VAT percentage.</p>
        </div>

        <form id="shipping-form" onsubmit="window.AdminShippingView.saveShipping(event)" class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 text-xs shadow-sm">
          <div>
            <label class="font-semibold block mb-1">Standard Shipping Fee ($) *</label>
            <input type="number" step="0.01" id="ship-fee" required value="${settings.shipping_fee || 15}" class="input-field py-2 text-xs">
          </div>

          <div>
            <label class="font-semibold block mb-1">Minimum Order for FREE Shipping ($) *</label>
            <input type="number" step="0.01" id="ship-free-min" required value="${settings.free_shipping_min || 150}" class="input-field py-2 text-xs">
          </div>

          <div>
            <label class="font-semibold block mb-1">Tax Percentage (%) *</label>
            <input type="number" step="0.1" id="ship-tax" required value="${settings.tax_rate || 18}" class="input-field py-2 text-xs">
          </div>

          <div class="pt-4 flex justify-end">
            <button type="submit" class="btn btn-primary text-xs">Save Shipping & Tax Rules</button>
          </div>
        </form>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-shipping");
  },

  saveShipping(event) {
    event.preventDefault();
    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});
    settings.shipping_fee = parseFloat(document.getElementById("ship-fee").value);
    settings.free_shipping_min = parseFloat(document.getElementById("ship-free-min").value);
    settings.tax_rate = parseFloat(document.getElementById("ship-tax").value);

    window.Store.setItem(window.Store.STORAGE_KEYS.SETTINGS, settings);
    alert("Shipping & Tax settings updated!");
    window.App.renderCurrentView();
  }
};

window.AdminReviewsView = {
  render() {
    const reviews = window.Store.getItem(window.Store.STORAGE_KEYS.REVIEWS, []);

    const content = `
      <div class="space-y-8">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Customer Reviews Moderation</h1>
          <p class="text-xs text-on-surface-variant">Approve or hide customer product feedback and ratings.</p>
        </div>

        ${reviews.length === 0 ? `
          <div class="p-8 rounded-xl bg-surface border border-outline-variant/30 text-center text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl text-outline mb-2">rate_review</span>
            <p>No customer reviews submitted yet.</p>
          </div>
        ` : `
          <div class="space-y-4">
            ${reviews.map(r => `
              <div class="p-4 rounded-xl bg-surface border border-outline-variant/30 flex justify-between items-center text-xs">
                <div>
                  <strong class="text-primary font-bold text-sm">${r.author_name}</strong>
                  <div class="text-amber-500">★ ${r.rating} / 5</div>
                  <p class="text-on-surface mt-1">${r.comment}</p>
                </div>
                <button onclick="window.AdminReviewsView.deleteReview('${r.id}')" class="text-error font-semibold hover:underline">Remove</button>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    return window.AdminLayout.render(content, "admin-reviews");
  },

  deleteReview(reviewId) {
    let reviews = window.Store.getItem(window.Store.STORAGE_KEYS.REVIEWS, []);
    reviews = reviews.filter(r => r.id !== reviewId);
    window.Store.setItem(window.Store.STORAGE_KEYS.REVIEWS, reviews);
    window.App.renderCurrentView();
  }
};

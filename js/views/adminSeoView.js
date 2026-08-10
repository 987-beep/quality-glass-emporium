/* ========================================================
   QUALITY GLASS EMPORIUM - ADMIN SEO & CMS CONTENT VIEWS
   ======================================================== */

window.AdminSeoView = {
  render() {
    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});

    const content = `
      <div class="space-y-8 max-w-3xl">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">SEO & Metadata Settings</h1>
          <p class="text-xs text-on-surface-variant">Configure search engine titles, meta descriptions, and Open Graph share tags.</p>
        </div>

        <form id="seo-form" onsubmit="window.AdminSeoView.saveSeo(event)" class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 text-xs shadow-sm">
          <div>
            <label class="font-semibold block mb-1">Global Site Title Tag *</label>
            <input type="text" id="seo-title" required value="${settings.seo_title || 'Quality Glass Emporium & Photo Framing Center | Raebareli'}" class="input-field py-2 text-xs">
          </div>

          <div>
            <label class="font-semibold block mb-1">Meta Description *</label>
            <textarea id="seo-desc" required rows="3" class="input-field py-2 text-xs">${settings.seo_description || 'Premium custom photo framing, museum-grade glass, toughened glass, acrylic float frames, and mirror solutions in Raebareli.'}</textarea>
          </div>

          <div class="pt-4 flex justify-end">
            <button type="submit" class="btn btn-primary text-xs">Save Meta Settings</button>
          </div>
        </form>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-seo");
  },

  saveSeo(event) {
    event.preventDefault();
    const settings = window.Store.getItem(window.Store.STORAGE_KEYS.SETTINGS, {});
    settings.seo_title = document.getElementById("seo-title").value.trim();
    settings.seo_description = document.getElementById("seo-desc").value.trim();

    window.Store.setItem(window.Store.STORAGE_KEYS.SETTINGS, settings);
    alert("SEO Meta settings saved!");
    window.App.renderCurrentView();
  }
};

window.AdminContentView = {
  render() {
    const content = `
      <div class="space-y-8 max-w-3xl">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Website Content CMS Editor</h1>
          <p class="text-xs text-on-surface-variant">Edit static pages (About Us, Contact Us, Return & Framing Guarantee Policy).</p>
        </div>

        <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 text-xs shadow-sm">
          <div>
            <label class="font-semibold block mb-1">Select Page to Edit</label>
            <select class="input-field py-2 text-xs">
              <option>About Quality Glass Emporium</option>
              <option>Raebareli Workshop & Custom Framing Guarantees</option>
              <option>Shipping & Packaging Policy</option>
            </select>
          </div>

          <div>
            <label class="font-semibold block mb-1">Page HTML / Markdown Content</label>
            <textarea rows="8" class="input-field py-2 text-xs font-mono">
Quality Glass Emporium And Photo Framing Center located at Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001. Rated 4.9/5 stars. We specialize in custom woodwork framing, museum UV glass, acrylic float mounts, and toughened structural glass.
            </textarea>
          </div>

          <div class="flex justify-end">
            <button onclick="alert('CMS content updated!')" class="btn btn-primary text-xs">Update CMS Content</button>
          </div>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-content");
  }
};

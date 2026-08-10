/* ========================================================
   QUALITY GLASS EMPORIUM - ADMIN CATEGORIES & BANNERS VIEWS
   ======================================================== */

window.AdminCategoriesView = {
  render() {
    const categories = window.Store.getItem(window.Store.STORAGE_KEYS.CATEGORIES, []);

    const content = `
      <div class="space-y-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="font-headline-lg text-primary text-2xl font-bold">Category Taxonomy Management</h1>
            <p class="text-xs text-on-surface-variant">Organize framing types, glass varieties, and decorative mirrors.</p>
          </div>
          <button onclick="window.AdminCategoriesView.addCategory()" class="btn btn-primary text-xs">
            <span class="material-symbols-outlined text-sm">add</span> Add Category
          </button>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <table class="w-full text-left text-xs">
            <thead class="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
              <tr>
                <th class="p-3">Category Name</th>
                <th class="p-3">Slug</th>
                <th class="p-3">Description</th>
                <th class="p-3">Display Order</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20">
              ${categories.map(c => `
                <tr>
                  <td class="p-3 font-semibold text-primary">${c.name}</td>
                  <td class="p-3 font-mono text-on-surface-variant">${c.slug}</td>
                  <td class="p-3 text-on-surface-variant max-w-xs truncate">${c.description}</td>
                  <td class="p-3 font-mono">${c.display_order || 1}</td>
                  <td class="p-3 space-x-2">
                    <button onclick="window.AdminCategoriesView.deleteCategory('${c.id}')" class="text-error font-semibold hover:underline">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-categories");
  },

  addCategory() {
    const name = prompt("Enter Category Name (e.g. Vintage Wood Frames):");
    if (!name) return;
    const desc = prompt("Enter Short Description:");
    const categories = window.Store.getItem(window.Store.STORAGE_KEYS.CATEGORIES, []);
    const newCat = {
      id: "c_" + Date.now(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: desc || "",
      display_order: categories.length + 1
    };
    categories.push(newCat);
    window.Store.setItem(window.Store.STORAGE_KEYS.CATEGORIES, categories);
    alert("Category created successfully!");
    window.App.renderCurrentView();
  },

  deleteCategory(catId) {
    if (confirm("Delete this category?")) {
      let categories = window.Store.getItem(window.Store.STORAGE_KEYS.CATEGORIES, []);
      categories = categories.filter(c => c.id !== catId);
      window.Store.setItem(window.Store.STORAGE_KEYS.CATEGORIES, categories);
      window.App.renderCurrentView();
    }
  }
};

window.AdminBannersView = {
  render() {
    const banners = window.Store.getItem(window.Store.STORAGE_KEYS.BANNERS, []);

    const content = `
      <div class="space-y-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="font-headline-lg text-primary text-2xl font-bold">Homepage Banners & Carousels</h1>
            <p class="text-xs text-on-surface-variant">Manage hero promotional slides and storefront announcements.</p>
          </div>
          <button onclick="window.AdminBannersView.addBanner()" class="btn btn-primary text-xs">
            <span class="material-symbols-outlined text-sm">add_photo_alternate</span> Add Hero Banner
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${banners.map(b => `
            <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-3 shadow-sm">
              <div class="h-40 rounded-xl overflow-hidden bg-black/10">
                <img src="${b.image_url}" class="w-full h-full object-cover">
              </div>
              <h3 class="font-bold text-base text-primary">${b.title}</h3>
              <p class="text-xs text-on-surface-variant">${b.subtitle || ''}</p>
              <div class="flex justify-between items-center pt-2 border-t border-outline-variant/20">
                <span class="badge ${b.is_active ? 'badge-green' : 'badge-red'}">${b.is_active ? 'Active' : 'Inactive'}</span>
                <button onclick="window.AdminBannersView.deleteBanner('${b.id}')" class="text-xs text-error font-semibold hover:underline">Remove</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-banners");
  },

  addBanner() {
    const title = prompt("Enter Banner Title (e.g., Museum Quality Frames):");
    if (!title) return;
    const subtitle = prompt("Enter Banner Subtitle:");
    const img = prompt("Enter Image URL:", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80");
    const banners = window.Store.getItem(window.Store.STORAGE_KEYS.BANNERS, []);
    banners.unshift({
      id: "b_" + Date.now(),
      title,
      subtitle: subtitle || "",
      image_url: img || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
      is_active: true
    });
    window.Store.setItem(window.Store.STORAGE_KEYS.BANNERS, banners);
    alert("Banner added!");
    window.App.renderCurrentView();
  },

  deleteBanner(bannerId) {
    if (confirm("Delete this banner?")) {
      let banners = window.Store.getItem(window.Store.STORAGE_KEYS.BANNERS, []);
      banners = banners.filter(b => b.id !== bannerId);
      window.Store.setItem(window.Store.STORAGE_KEYS.BANNERS, banners);
      window.App.renderCurrentView();
    }
  }
};

/* ========================================================
   QUALITY GLASS EMPORIUM - ADMIN PRODUCT MANAGEMENT
   ======================================================== */

window.AdminProductsView = {
  render() {
    const products = window.Store.getItem(window.Store.STORAGE_KEYS.PRODUCTS, []);
    const categories = window.Store.getItem(window.Store.STORAGE_KEYS.CATEGORIES, []);

    const content = `
      <div class="space-y-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="font-headline-lg text-primary text-2xl font-bold">Products & Pricing Management</h1>
            <p class="text-xs text-on-surface-variant">Add, edit, or archive custom framing, glass, and mirror catalog items.</p>
          </div>
          <button onclick="window.AdminProductsView.openProductModal()" class="btn btn-primary text-xs">
            <span class="material-symbols-outlined text-sm">add</span> Create New Product
          </button>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <table class="w-full text-left text-xs">
            <thead class="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
              <tr>
                <th class="p-3">Product Name</th>
                <th class="p-3">SKU</th>
                <th class="p-3">Category</th>
                <th class="p-3">Price</th>
                <th class="p-3">Sale Price</th>
                <th class="p-3">Stock</th>
                <th class="p-3">Status</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20">
              ${products.map(p => {
                const cat = categories.find(c => c.id === p.category_id);
                return `
                  <tr>
                    <td class="p-3 font-semibold text-on-surface flex items-center gap-3">
                      <img src="${p.images ? p.images[0] : ''}" class="w-10 h-10 rounded-lg object-cover bg-surface-container-low">
                      <span>${p.name}</span>
                    </td>
                    <td class="p-3 font-mono">${p.sku}</td>
                    <td class="p-3">${cat ? cat.name : 'Uncategorized'}</td>
                    <td class="p-3 font-bold">$${p.price.toFixed(2)}</td>
                    <td class="p-3 font-bold text-success">${p.sale_price ? '$' + p.sale_price.toFixed(2) : '-'}</td>
                    <td class="p-3 font-semibold">${p.stock_quantity}</td>
                    <td class="p-3"><span class="badge ${p.is_published ? 'badge-green' : 'badge-red'}">${p.is_published ? 'Published' : 'Draft'}</span></td>
                    <td class="p-3 space-x-2">
                      <button onclick="window.AdminProductsView.editProduct('${p.id}')" class="text-secondary font-semibold hover:underline">Edit</button>
                      <button onclick="window.AdminProductsView.deleteProduct('${p.id}')" class="text-error font-semibold hover:underline">Delete</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Product Modal -->
      <div id="product-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center hidden">
        <div class="bg-surface rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-xl border border-outline-variant">
          <div class="flex justify-between items-center border-b border-outline-variant/20 pb-3">
            <h3 id="modal-title" class="font-headline-md text-lg text-primary font-bold">Product Form</h3>
            <button onclick="document.getElementById('product-modal').classList.add('hidden')" class="text-on-surface-variant hover:text-primary">✕</button>
          </div>

          <form id="product-form" onsubmit="window.AdminProductsView.saveProduct(event)" class="space-y-3 text-xs">
            <input type="hidden" id="prod-id">

            <div>
              <label class="font-semibold block mb-1">Product Title *</label>
              <input type="text" id="prod-name" required class="input-field py-2 text-xs">
            </div>

            <div>
              <label class="font-semibold block mb-1">Description *</label>
              <textarea id="prod-desc" required rows="3" class="input-field py-2 text-xs"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-semibold block mb-1">Standard Price ($) *</label>
                <input type="number" step="0.01" id="prod-price" required class="input-field py-2 text-xs">
              </div>
              <div>
                <label class="font-semibold block mb-1">Sale Price ($)</label>
                <input type="number" step="0.01" id="prod-sale-price" class="input-field py-2 text-xs">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-semibold block mb-1">SKU *</label>
                <input type="text" id="prod-sku" required class="input-field py-2 text-xs font-mono">
              </div>
              <div>
                <label class="font-semibold block mb-1">Stock Quantity *</label>
                <input type="number" id="prod-stock" required class="input-field py-2 text-xs">
              </div>
            </div>

            <div>
              <label class="font-semibold block mb-1">Category</label>
              <select id="prod-cat" class="input-field py-2 text-xs">
                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="font-semibold block mb-1">Image URL</label>
              <input type="url" id="prod-img" class="input-field py-2 text-xs" placeholder="https://...">
            </div>

            <div class="pt-4 flex justify-end gap-2">
              <button type="button" onclick="document.getElementById('product-modal').classList.add('hidden')" class="btn btn-secondary text-xs">Cancel</button>
              <button type="submit" class="btn btn-primary text-xs">Save Product</button>
            </div>
          </form>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-products");
  },

  openProductModal(product = null) {
    const modal = document.getElementById("product-modal");
    if (!modal) return;
    modal.classList.remove("hidden");

    document.getElementById("modal-title").innerText = product ? "Edit Product" : "Create New Product";
    document.getElementById("prod-id").value = product ? product.id : "";
    document.getElementById("prod-name").value = product ? product.name : "";
    document.getElementById("prod-desc").value = product ? product.description : "";
    document.getElementById("prod-price").value = product ? product.price : "";
    document.getElementById("prod-sale-price").value = product && product.sale_price ? product.sale_price : "";
    document.getElementById("prod-sku").value = product ? product.sku : "QG-PRD-" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById("prod-stock").value = product ? product.stock_quantity : 25;
    document.getElementById("prod-img").value = product && product.images ? product.images[0] : "";
  },

  editProduct(productId) {
    const products = window.Store.getItem(window.Store.STORAGE_KEYS.PRODUCTS, []);
    const product = products.find(p => p.id === productId);
    if (product) this.openProductModal(product);
  },

  saveProduct(event) {
    event.preventDefault();
    const products = window.Store.getItem(window.Store.STORAGE_KEYS.PRODUCTS, []);
    const id = document.getElementById("prod-id").value;
    const name = document.getElementById("prod-name").value.trim();
    const desc = document.getElementById("prod-desc").value.trim();
    const price = parseFloat(document.getElementById("prod-price").value);
    const salePrice = document.getElementById("prod-sale-price").value ? parseFloat(document.getElementById("prod-sale-price").value) : null;
    const sku = document.getElementById("prod-sku").value.trim();
    const stock = parseInt(document.getElementById("prod-stock").value);
    const catId = document.getElementById("prod-cat").value;
    const img = document.getElementById("prod-img").value.trim() || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80";

    const user = window.Auth.getCurrentUser();

    if (id) {
      const idx = products.findIndex(p => p.id === id);
      if (idx > -1) {
        products[idx] = { ...products[idx], name, description: desc, price, sale_price: salePrice, sku, stock_quantity: stock, category_id: catId, images: [img] };
        window.Store.addAuditLog(user ? user.displayName : 'Admin', `Updated Product ${name}`, "Product", id);
      }
    } else {
      const newProd = {
        id: "p_" + Date.now(),
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: desc,
        price,
        sale_price: salePrice,
        sku,
        stock_quantity: stock,
        category_id: catId,
        is_published: true,
        is_featured: true,
        images: [img]
      };
      products.unshift(newProd);
      window.Store.addAuditLog(user ? user.displayName : 'Admin', `Created Product ${name}`, "Product", newProd.id);
    }

    window.Store.setItem(window.Store.STORAGE_KEYS.PRODUCTS, products);
    document.getElementById("product-modal").classList.add("hidden");
    alert("Product saved successfully!");
    window.App.renderCurrentView();
  },

  deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
      let products = window.Store.getItem(window.Store.STORAGE_KEYS.PRODUCTS, []);
      products = products.filter(p => p.id !== productId);
      window.Store.setItem(window.Store.STORAGE_KEYS.PRODUCTS, products);
      window.App.renderCurrentView();
    }
  }
};

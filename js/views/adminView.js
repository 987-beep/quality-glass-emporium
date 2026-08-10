/* ============================================================
   QUALITY GLASS EMPORIUM - COMPLETE ADMIN WORKSPACE VIEW
   ============================================================ */

window.renderAdminView = async function() {
  const store = window.appStore;
  const user = store.currentUser;

  // Security Gate: Admin role check
  if (!user || user.role !== 'admin') {
    store.showToast('Access denied. Administrator privileges required.', 'error');
    store.navigateTo('login');
    return '';
  }

  const subTab = store.adminSubTab || 'dashboard';

  // Load data from DB Engine
  const products = await window.dbEngine.getProducts();
  const categories = await window.dbEngine.getCategories();
  const orders = await window.dbEngine.getOrders();
  const payments = await window.dbEngine.db.payments;
  const banners = await window.dbEngine.getBanners();
  const coupons = await window.dbEngine.getCoupons();
  const reviews = await window.dbEngine.getReviews();
  const settings = await window.dbEngine.getSiteSettings();
  const auditLogs = await window.dbEngine.getAuditLogs();

  // Metrics
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const pendingPaymentsCount = payments.filter(p => p.paymentStatus === 'pending').length;
  const lowStockCount = products.filter(p => p.inventoryCount < 20).length;

  return `
    <div class="flex flex-col md:flex-row gap-6 animate-fade-in min-h-[calc(100vh-140px)]">
      <!-- Admin Sidebar -->
      ${window.renderAdminSidebar()}

      <!-- Main Workspace Panel -->
      <main class="flex-1 bg-white dark:bg-charcoal-bg rounded-xl border border-outline-variant/30 p-6 md:p-8 space-y-6 shadow-sm overflow-x-auto">
        <!-- Header -->
        <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 class="font-display-lg text-2xl font-bold text-primary dark:text-white capitalize">
              ${subTab.replace('_', ' ')} Management
            </h1>
            <p class="text-xs text-subtle-gray">Logged in as ${user.name} (${user.loginId || user.email})</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span class="text-xs font-bold text-emerald-600">Supabase DB Syncing</span>
          </div>
        </div>

        <!-- SUBTAB 1: DASHBOARD -->
        ${subTab === 'dashboard' ? `
          <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-5 rounded-xl bg-blue-50 border border-blue-100 space-y-2">
                <div class="text-xs font-bold text-secondary uppercase">Total Revenue</div>
                <div class="text-2xl font-extrabold text-primary">$${totalSales.toFixed(2)}</div>
                <div class="text-[11px] text-gray-500">${orders.length} Total Orders</div>
              </div>
              <div class="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div class="text-xs font-bold text-amber-800 uppercase">Pending Payments</div>
                <div class="text-2xl font-extrabold text-amber-900">${pendingPaymentsCount} Receipts</div>
                <button onclick="window.appStore.setAdminSubTab('payments')" class="text-xs text-amber-700 underline font-bold">Review Now →</button>
              </div>
              <div class="p-5 rounded-xl bg-emerald-50 border border-emerald-100 space-y-2">
                <div class="text-xs font-bold text-emerald-800 uppercase">Active Catalog</div>
                <div class="text-2xl font-extrabold text-emerald-900">${products.length} Products</div>
                <div class="text-[11px] text-gray-500">${categories.length} Categories</div>
              </div>
              <div class="p-5 rounded-xl bg-red-50 border border-red-100 space-y-2">
                <div class="text-xs font-bold text-red-800 uppercase">Low Stock Alert</div>
                <div class="text-2xl font-extrabold text-red-900">${lowStockCount} Items</div>
                <div class="text-[11px] text-gray-500">Requires reordering</div>
              </div>
            </div>

            <!-- Recent Orders Feed -->
            <div class="space-y-3 pt-4 border-t border-gray-100">
              <h3 class="font-bold text-base text-primary dark:text-white">Recent Orders Queue</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-gray-50 border-b border-gray-200">
                      <th class="p-3 font-bold">Order #</th>
                      <th class="p-3 font-bold">Customer</th>
                      <th class="p-3 font-bold">Total</th>
                      <th class="p-3 font-bold">Status</th>
                      <th class="p-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orders.map(o => `
                      <tr class="border-b border-gray-100">
                        <td class="p-3 font-mono font-bold">${o.orderNumber}</td>
                        <td class="p-3">${o.customerName}</td>
                        <td class="p-3 font-bold">$${o.totalAmount.toFixed(2)}</td>
                        <td class="p-3"><span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">${o.status}</span></td>
                        <td class="p-3">
                          <button onclick="window.appStore.setAdminSubTab('payments')" class="text-secondary underline font-bold">Review</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- SUBTAB 2: PAYMENT APPROVALS (admin_orders_approval) -->
        ${subTab === 'payments' ? `
          <div class="space-y-6">
            <h3 class="font-bold text-base text-primary dark:text-white">Uploaded Payment Proof Receipts Workspace</h3>
            <div class="space-y-4">
              ${payments.map(p => `
                <div class="p-5 rounded-xl border border-gray-200 space-y-4 bg-surface-container-low">
                  <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div class="font-bold text-sm text-primary dark:text-white">
                        Order ${p.orderNumber} • ${p.customerName}
                      </div>
                      <div class="text-xs text-subtle-gray">
                        Amount Due: <strong class="text-primary">$${p.amount.toFixed(2)}</strong> via <span class="uppercase font-mono">${p.paymentMethod}</span>
                      </div>
                      <div class="text-[11px] text-gray-400">Uploaded: ${new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="px-3 py-1 rounded-full text-xs font-bold ${p.paymentStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : p.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}">
                        ${p.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  ${p.proofUrl ? `
                    <div class="flex gap-4 items-center bg-white p-3 rounded-lg border">
                      <img src="${p.proofUrl}" alt="Payment Proof" class="w-24 h-24 object-cover rounded border cursor-pointer" onclick="window.open('${p.proofUrl}')">
                      <div class="space-y-2 text-xs flex-1">
                        <div class="font-bold text-gray-700">Uploaded Receipt Image</div>
                        <a href="${p.proofUrl}" target="_blank" class="text-secondary underline font-semibold">View Full Image Screen</a>
                      </div>
                    </div>
                  ` : ''}

                  <!-- Admin Action Buttons -->
                  <div class="flex gap-3 pt-2">
                    <button onclick="window.dbEngine.approvePayment('${p.id}', 'Verified by Admin').then(() => window.appStore.notify())" class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700">
                      ✓ Approve Payment
                    </button>
                    <button onclick="window.dbEngine.rejectPayment('${p.id}', 'Receipt unreadable or invalid').then(() => window.appStore.notify())" class="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700">
                      ✗ Reject Payment
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- SUBTAB 3: PRODUCTS & PRICING (admin_products_pricing_desktop) -->
        ${subTab === 'products' ? `
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-base text-primary dark:text-white">Product Inventory & Pricing</h3>
              <button onclick="alert('Creating new product... Use seed product editor.')" class="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold">
                + Add New Product
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-gray-50 border-b">
                    <th class="p-3">Product</th>
                    <th class="p-3">SKU</th>
                    <th class="p-3">Price</th>
                    <th class="p-3">Sale Price</th>
                    <th class="p-3">Stock</th>
                    <th class="p-3">Status</th>
                    <th class="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${products.map(p => `
                    <tr class="border-b">
                      <td class="p-3 flex items-center gap-2 font-bold">
                        <img src="${p.imageUrl}" class="w-8 h-8 rounded object-cover">
                        <span>${p.name}</span>
                      </td>
                      <td class="p-3 font-mono">${p.sku}</td>
                      <td class="p-3 font-bold">$${p.price.toFixed(2)}</td>
                      <td class="p-3 text-red-600">${p.salePrice ? '$' + p.salePrice.toFixed(2) : '-'}</td>
                      <td class="p-3"><span class="px-2 py-0.5 rounded ${p.inventoryCount < 20 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'} font-bold">${p.inventoryCount}</span></td>
                      <td class="p-3 font-bold capitalize">${p.status}</td>
                      <td class="p-3">
                        <button onclick="window.dbEngine.deleteProduct('${p.id}').then(() => window.appStore.notify())" class="text-red-500 font-bold">Delete</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- SUBTAB 4: ORDERS & LOGISTICS (admin_orders_logistics_desktop) -->
        ${subTab === 'orders' ? `
          <div class="space-y-4">
            <h3 class="font-bold text-base text-primary dark:text-white">Order Fulfillment & Logistics</h3>
            <div class="space-y-4">
              ${orders.map(o => `
                <div class="p-4 rounded-xl border space-y-3 text-xs bg-gray-50">
                  <div class="flex justify-between font-bold">
                    <span>${o.orderNumber} • ${o.customerName}</span>
                    <span class="text-secondary">$${o.totalAmount.toFixed(2)}</span>
                  </div>
                  <div>Address: ${o.shippingAddress}</div>
                  <div class="flex gap-2">
                    <button onclick="window.dbEngine.updateOrderStatus('${o.id}', 'shipped').then(() => window.appStore.notify())" class="bg-blue-600 text-white px-3 py-1 rounded font-bold">Mark Shipped</button>
                    <button onclick="window.dbEngine.updateOrderStatus('${o.id}', 'delivered').then(() => window.appStore.notify())" class="bg-purple-600 text-white px-3 py-1 rounded font-bold">Mark Delivered</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- SUBTAB 5: CATEGORIES (admin_categories_taxonomy_desktop) -->
        ${subTab === 'categories' ? `
          <div class="space-y-4">
            <h3 class="font-bold text-base text-primary dark:text-white">Categories Taxonomy</h3>
            <div class="grid grid-cols-2 gap-4">
              ${categories.map(c => `
                <div class="p-4 rounded-xl border flex items-center justify-between">
                  <div class="font-bold">${c.name}</div>
                  <span class="text-xs text-subtle-gray">${c.slug}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- SUBTAB 6: BANNERS (admin_banners_carousels_desktop) -->
        ${subTab === 'banners' ? `
          <div class="space-y-4">
            <h3 class="font-bold text-base text-primary dark:text-white">Storefront Hero Carousels</h3>
            ${banners.map(b => `
              <div class="p-4 rounded-xl border space-y-2">
                <div class="font-bold text-sm">${b.title}</div>
                <div class="text-xs text-subtle-gray">${b.subtitle}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- SUBTAB 7: BRANDING (admin_branding_store_info_desktop) -->
        ${subTab === 'branding' ? `
          <div class="space-y-4 max-w-lg">
            <h3 class="font-bold text-base text-primary dark:text-white">Store Information & Raebareli Details</h3>
            <div class="space-y-3 text-xs">
              <div><label class="font-bold">Store Name</label><input type="text" value="${settings.storeName}" class="w-full p-2 border rounded"></div>
              <div><label class="font-bold">Address</label><input type="text" value="${settings.address}" class="w-full p-2 border rounded"></div>
              <div><label class="font-bold">Phone</label><input type="text" value="${settings.phone}" class="w-full p-2 border rounded"></div>
            </div>
          </div>
        ` : ''}

        <!-- SUBTAB 8: AUDIT LOGS (admin_workspace_tools) -->
        ${subTab === 'tools' || subTab === 'workspace' || subTab === 'coupons' || subTab === 'shipping' || subTab === 'gateways' || subTab === 'reviews' || subTab === 'seo' || subTab === 'customers' || subTab === 'content' ? `
          <div class="space-y-4">
            <h3 class="font-bold text-base text-primary dark:text-white">Admin Operations & Audit Feed</h3>
            <div class="space-y-2 font-mono text-xs">
              ${auditLogs.map(l => `
                <div class="p-3 bg-gray-50 border rounded flex justify-between">
                  <div><strong>${l.adminName}:</strong> ${l.action} (${l.details})</div>
                  <div class="text-gray-400">${new Date(l.timestamp).toLocaleTimeString()}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </main>
    </div>
  `;
};

/* ========================================================
   QUALITY GLASS EMPORIUM - ADMIN ANALYTICS DASHBOARD
   ======================================================== */

window.AdminDashboardView = {
  render() {
    const products = window.Store.getItem(window.Store.STORAGE_KEYS.PRODUCTS, []);
    const orders = window.Store.getItem(window.Store.STORAGE_KEYS.ORDERS, []);
    const users = window.Auth.getUsers();

    const totalSales = orders.filter(o => o.payment_status === 'approved').reduce((sum, o) => sum + o.total_amount, 0);
    const totalOrdersCount = orders.length;
    const pendingApprovalCount = orders.filter(o => o.payment_status === 'pending' || o.payment_status === 'under_review').length;
    const lowStockProducts = products.filter(p => p.stock_quantity <= 20);

    const content = `
      <div class="space-y-8">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Workspace Overview</h1>
          <p class="text-xs text-on-surface-variant">Real-time metrics & management statistics connected to Supabase backend.</p>
        </div>

        <!-- Metric Stat Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-2 shadow-sm">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="text-xs font-semibold uppercase">Total Revenue</span>
              <span class="material-symbols-outlined text-secondary">payments</span>
            </div>
            <div class="text-3xl font-bold text-primary">$${totalSales.toFixed(2)}</div>
            <p class="text-[11px] text-success font-medium">Verified Approved Payments</p>
          </div>

          <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-2 shadow-sm">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="text-xs font-semibold uppercase">Total Orders</span>
              <span class="material-symbols-outlined text-secondary">shopping_bag</span>
            </div>
            <div class="text-3xl font-bold text-primary">${totalOrdersCount}</div>
            <p class="text-[11px] text-on-surface-variant">Placed by customers</p>
          </div>

          <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-2 shadow-sm">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="text-xs font-semibold uppercase">Pending Approvals</span>
              <span class="material-symbols-outlined text-amber-500">pending_actions</span>
            </div>
            <div class="text-3xl font-bold text-amber-600">${pendingApprovalCount}</div>
            <p class="text-[11px] text-amber-600 font-medium">Awaiting receipt verification</p>
          </div>

          <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-2 shadow-sm">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="text-xs font-semibold uppercase">Total Products</span>
              <span class="material-symbols-outlined text-secondary">inventory_2</span>
            </div>
            <div class="text-3xl font-bold text-primary">${products.length}</div>
            <p class="text-[11px] text-on-surface-variant">${lowStockProducts.length} low stock items</p>
          </div>
        </div>

        <!-- Recent Orders & Actions Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 shadow-sm">
            <div class="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h2 class="font-headline-md text-lg text-primary font-bold">Recent Customer Orders</h2>
              <button onclick="window.App.navigate('admin-orders-approval')" class="text-xs text-secondary font-semibold hover:underline">View Approvals</button>
            </div>

            ${orders.length === 0 ? `
              <p class="text-xs text-on-surface-variant py-4 text-center">No orders recorded yet.</p>
            ` : `
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
                    <tr>
                      <th class="p-3">Order #</th>
                      <th class="p-3">Customer</th>
                      <th class="p-3">Amount</th>
                      <th class="p-3">Payment Status</th>
                      <th class="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant/20">
                    ${orders.slice(0, 5).map(o => `
                      <tr>
                        <td class="p-3 font-mono font-bold">${o.order_number}</td>
                        <td class="p-3">${o.customer_name}</td>
                        <td class="p-3 font-bold">$${o.total_amount.toFixed(2)}</td>
                        <td class="p-3"><span class="badge ${o.payment_status === 'approved' ? 'badge-green' : o.payment_status === 'rejected' ? 'badge-red' : 'badge-gold'}">${o.payment_status}</span></td>
                        <td class="p-3">
                          <button onclick="window.App.navigate('admin-orders-approval')" class="text-secondary font-semibold hover:underline">Inspect</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Quick Admin Action Card -->
          <div class="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-sm">
            <h2 class="font-headline-md text-lg text-primary font-bold">Quick Management</h2>

            <div class="space-y-3">
              <button onclick="window.App.navigate('admin-products')" class="w-full btn btn-primary justify-start py-3 text-xs">
                <span class="material-symbols-outlined">add_box</span> Add New Product & Pricing
              </button>
              <button onclick="window.App.navigate('admin-banners')" class="w-full btn btn-secondary justify-start py-3 text-xs">
                <span class="material-symbols-outlined">image</span> Edit Homepage Banners
              </button>
              <button onclick="window.App.navigate('admin-branding')" class="w-full btn btn-secondary justify-start py-3 text-xs">
                <span class="material-symbols-outlined">storefront</span> Update Store Info & Hours
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-dashboard");
  }
};

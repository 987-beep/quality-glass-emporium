/* ========================================================
   QUALITY GLASS EMPORIUM - ADMIN CUSTOMERS & AUDIT VIEWS
   ======================================================== */

window.AdminCustomersView = {
  render() {
    const users = window.Auth.getUsers();

    const content = `
      <div class="space-y-8">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Registered User Accounts</h1>
          <p class="text-xs text-on-surface-variant">View customer profiles and default administrator accounts seeded in Supabase Auth.</p>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <table class="w-full text-left text-xs">
            <thead class="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
              <tr>
                <th class="p-3">User ID / Handle</th>
                <th class="p-3">Display Name</th>
                <th class="p-3">Email Address</th>
                <th class="p-3">Assigned Role</th>
                <th class="p-3">Registered At</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20">
              ${users.map(u => `
                <tr>
                  <td class="p-3 font-mono font-bold text-primary">${u.username}</td>
                  <td class="p-3 font-semibold">${u.displayName}</td>
                  <td class="p-3">${u.email}</td>
                  <td class="p-3"><span class="badge ${u.role === 'admin' ? 'badge-gold' : 'badge-blue'}">${u.role.toUpperCase()}</span></td>
                  <td class="p-3 text-on-surface-variant">${new Date(u.created_at || Date.now()).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-customers");
  }
};

window.AdminGatewaysView = {
  render() {
    const content = `
      <div class="space-y-8 max-w-3xl">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Payment Gateways & Proof Settings</h1>
          <p class="text-xs text-on-surface-variant">Configure direct bank transfer, UPI QR codes, and automated proof collection.</p>
        </div>

        <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 text-xs shadow-sm">
          <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex justify-between items-center">
            <div>
              <strong class="text-primary font-bold text-sm block">Direct Bank Transfer & UPI Proof Upload</strong>
              <span class="text-on-surface-variant">Primary store payment workflow for custom glass quotes and order deposits.</span>
            </div>
            <span class="badge badge-green">ACTIVE</span>
          </div>

          <div class="space-y-3">
            <div>
              <label class="font-semibold block mb-1">Official UPI ID</label>
              <input type="text" value="qualityglass@sbi" class="input-field py-2 text-xs font-mono">
            </div>
            <div>
              <label class="font-semibold block mb-1">Bank Name & Branch</label>
              <input type="text" value="State Bank of India - Raebareli Main Branch" class="input-field py-2 text-xs">
            </div>
            <div>
              <label class="font-semibold block mb-1">Account Number</label>
              <input type="text" value="39847502948" class="input-field py-2 text-xs font-mono">
            </div>
            <div>
              <label class="font-semibold block mb-1">IFSC Code</label>
              <input type="text" value="SBIN0001234" class="input-field py-2 text-xs font-mono">
            </div>
          </div>

          <div class="flex justify-end">
            <button onclick="alert('Gateway settings saved!')" class="btn btn-primary text-xs">Save Gateway Credentials</button>
          </div>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-gateways");
  }
};

window.AdminLogisticsView = {
  render() {
    const orders = window.Store.getItem(window.Store.STORAGE_KEYS.ORDERS, []);

    const content = `
      <div class="space-y-8">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Order Logistics & Tracking</h1>
          <p class="text-xs text-on-surface-variant">Update shipping status, add courier tracking numbers, and manage dispatch notes.</p>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <table class="w-full text-left text-xs">
            <thead class="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
              <tr>
                <th class="p-3">Order #</th>
                <th class="p-3">Customer</th>
                <th class="p-3">Fulfillment Status</th>
                <th class="p-3">Tracking Number</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20">
              ${orders.length === 0 ? `
                <tr><td colspan="5" class="p-4 text-center text-on-surface-variant">No orders recorded yet.</td></tr>
              ` : orders.map(o => `
                <tr>
                  <td class="p-3 font-mono font-bold text-primary">${o.order_number}</td>
                  <td class="p-3">${o.customer_name}</td>
                  <td class="p-3"><span class="badge badge-blue">${o.order_status.replace(/_/g, ' ').toUpperCase()}</span></td>
                  <td class="p-3 font-mono">${o.tracking_number || 'Unassigned'}</td>
                  <td class="p-3">
                    <button onclick="window.AdminLogisticsView.updateTracking('${o.id}')" class="text-secondary font-semibold hover:underline">Update Tracking</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-logistics");
  },

  updateTracking(orderId) {
    const tracking = prompt("Enter Courier Tracking Number (e.g. DTDC-9847291):");
    if (!tracking) return;
    const orders = window.Store.getItem(window.Store.STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx > -1) {
      orders[idx].tracking_number = tracking.trim();
      orders[idx].order_status = "shipped";
      window.Store.setItem(window.Store.STORAGE_KEYS.ORDERS, orders);
      alert("Tracking number assigned & order status changed to SHIPPED!");
      window.App.renderCurrentView();
    }
  }
};

window.AdminAuditView = {
  render() {
    const logs = window.Store.getItem(window.Store.STORAGE_KEYS.AUDIT_LOGS, []);

    const content = `
      <div class="space-y-8">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Admin Activity Audit Logs</h1>
          <p class="text-xs text-on-surface-variant">Audit trail of critical administrative changes, price updates, and payment approvals.</p>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <table class="w-full text-left text-xs">
            <thead class="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
              <tr>
                <th class="p-3">Timestamp</th>
                <th class="p-3">Admin Account</th>
                <th class="p-3">Action Description</th>
                <th class="p-3">Entity Type</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20">
              ${logs.length === 0 ? `
                <tr><td colspan="4" class="p-4 text-center text-on-surface-variant">No audit logs recorded yet.</td></tr>
              ` : logs.map(l => `
                <tr>
                  <td class="p-3 font-mono text-on-surface-variant">${new Date(l.timestamp).toLocaleString()}</td>
                  <td class="p-3 font-bold text-primary">${l.admin_username}</td>
                  <td class="p-3 text-on-surface font-medium">${l.action}</td>
                  <td class="p-3 font-semibold"><span class="badge badge-gold">${l.entity}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-audit");
  }
};

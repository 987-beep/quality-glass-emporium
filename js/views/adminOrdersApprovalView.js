/* ========================================================
   QUALITY GLASS EMPORIUM - ADMIN PAYMENT ORDERS APPROVAL
   ======================================================== */

window.AdminOrdersApprovalView = {
  render() {
    const orders = window.Store.getItem(window.Store.STORAGE_KEYS.ORDERS, []);
    const pendingOrders = orders.filter(o => o.payment_status === 'pending' || o.payment_status === 'under_review');
    const reviewedOrders = orders.filter(o => o.payment_status === 'approved' || o.payment_status === 'rejected');

    const content = `
      <div class="space-y-8">
        <div>
          <h1 class="font-headline-lg text-primary text-2xl font-bold">Payment Proof Verification & Approval</h1>
          <p class="text-xs text-on-surface-variant">Review customer uploaded transaction receipts, verify bank / UPI transfer IDs, and update status.</p>
        </div>

        <!-- Pending Approval Queue -->
        <div class="space-y-4">
          <h2 class="font-headline-md text-lg text-primary font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-500">hourglass_top</span>
            Pending Verification (${pendingOrders.length})
          </h2>

          ${pendingOrders.length === 0 ? `
            <div class="p-8 rounded-xl bg-surface border border-outline-variant/30 text-center text-on-surface-variant">
              <span class="material-symbols-outlined text-4xl text-success mb-2">task_alt</span>
              <p>No pending payment proofs awaiting approval.</p>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${pendingOrders.map(order => this.renderApprovalCard(order)).join('')}
            </div>
          `}
        </div>

        <!-- Order Review History -->
        <div class="space-y-4 pt-6 border-t border-outline-variant/30">
          <h2 class="font-headline-md text-lg text-primary font-bold">Reviewed Orders Log</h2>

          <div class="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <table class="w-full text-left text-xs">
              <thead class="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
                <tr>
                  <th class="p-3">Order #</th>
                  <th class="p-3">Customer</th>
                  <th class="p-3">Amount</th>
                  <th class="p-3">Transaction UTR</th>
                  <th class="p-3">Status</th>
                  <th class="p-3">Admin Notes</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/20">
                ${reviewedOrders.map(o => `
                  <tr>
                    <td class="p-3 font-mono font-bold">${o.order_number}</td>
                    <td class="p-3">${o.customer_name}</td>
                    <td class="p-3 font-bold">$${o.total_amount.toFixed(2)}</td>
                    <td class="p-3 font-mono">${o.transaction_id || 'N/A'}</td>
                    <td class="p-3"><span class="badge ${o.payment_status === 'approved' ? 'badge-green' : 'badge-red'}">${o.payment_status}</span></td>
                    <td class="p-3 text-on-surface-variant">${o.admin_notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    return window.AdminLayout.render(content, "admin-orders-approval");
  },

  renderApprovalCard(order) {
    return `
      <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 shadow-sm">
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div>
            <span class="font-bold text-base text-primary">${order.order_number}</span>
            <p class="text-xs text-on-surface-variant">${order.customer_name} (${order.customer_email})</p>
          </div>
          <span class="text-lg font-bold text-primary">$${order.total_amount.toFixed(2)}</span>
        </div>

        <div class="space-y-2 text-xs">
          <p><strong>Transaction Ref / UTR:</strong> <span class="font-mono bg-surface-container-high px-2 py-0.5 rounded text-primary">${order.transaction_id || 'Not provided'}</span></p>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
        </div>

        <!-- Receipt Proof Image Preview -->
        <div>
          <label class="text-xs font-semibold text-on-surface-variant block mb-1">Customer Receipt Proof File:</label>
          <div class="h-40 rounded-xl overflow-hidden bg-black/5 border border-outline-variant/30 relative">
            <img src="${order.payment_proof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'}" alt="Payment Proof" class="w-full h-full object-contain cursor-pointer" onclick="window.open(this.src, '_blank')">
          </div>
        </div>

        <!-- Decision Form -->
        <div class="space-y-2 pt-2">
          <input type="text" id="note-${order.id}" placeholder="Optional admin approval note..." class="input-field py-1.5 text-xs">
          <div class="flex gap-2">
            <button onclick="window.AdminOrdersApprovalView.approve('${order.id}')" class="btn btn-success flex-1 text-xs py-2">
              <span class="material-symbols-outlined text-sm">check_circle</span> Approve Payment
            </button>
            <button onclick="window.AdminOrdersApprovalView.reject('${order.id}')" class="btn btn-danger flex-1 text-xs py-2">
              <span class="material-symbols-outlined text-sm">cancel</span> Reject Payment
            </button>
          </div>
        </div>
      </div>
    `;
  },

  approve(orderId) {
    const note = document.getElementById(`note-${orderId}`) ? document.getElementById(`note-${orderId}`).value : "";
    const user = window.Auth.getCurrentUser();
    window.Store.updateOrderPaymentStatus(orderId, 'approved', 'confirmed', note, user ? user.displayName : 'Admin');
    alert("Payment Approved! Order status updated to CONFIRMED.");
    window.App.renderCurrentView();
  },

  reject(orderId) {
    const note = document.getElementById(`note-${orderId}`) ? document.getElementById(`note-${orderId}`).value : "";
    const user = window.Auth.getCurrentUser();
    window.Store.updateOrderPaymentStatus(orderId, 'rejected', 'payment_rejected', note, user ? user.displayName : 'Admin');
    alert("Payment Rejected. Order status updated to PAYMENT REJECTED.");
    window.App.renderCurrentView();
  }
};

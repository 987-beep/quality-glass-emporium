/* ========================================================
   QUALITY GLASS EMPORIUM - CUSTOMER DASHBOARD & ORDERS
   ======================================================== */

window.UserDashboardView = {
  render() {
    const user = window.Auth.getCurrentUser();
    if (!user) {
      return `
        <div class="max-w-md mx-auto py-12 p-8 rounded-2xl bg-surface border border-outline-variant/30 text-center space-y-6 shadow-sm">
          <span class="material-symbols-outlined text-5xl text-secondary">lock</span>
          <h2 class="font-headline-lg text-primary dark:text-primary-fixed">Account Access Required</h2>
          <p class="font-body-md text-on-surface-variant">Please log in to view your orders and personal profile.</p>
          <div class="flex gap-4 justify-center">
            <button onclick="window.App.navigate('login')" class="btn btn-primary">Sign In</button>
            <button onclick="window.App.navigate('register')" class="btn btn-secondary">Create Account</button>
          </div>
        </div>
      `;
    }

    const allOrders = window.Store.getItem(window.Store.STORAGE_KEYS.ORDERS, []);
    const myOrders = allOrders.filter(o => o.user_id === user.id || o.customer_email.toLowerCase() === user.email.toLowerCase());

    return `
      <div class="space-y-8">
        <!-- Account Header -->
        <div class="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl">
              ${user.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 class="font-headline-lg text-primary dark:text-primary-fixed text-2xl font-bold">${user.displayName}</h1>
              <p class="text-xs text-on-surface-variant font-mono">${user.username} • ${user.email}</p>
              <span class="badge ${user.role === 'admin' ? 'badge-gold' : 'badge-blue'} mt-1">${user.role.toUpperCase()} ACCOUNT</span>
            </div>
          </div>
          <div class="flex gap-3">
            ${user.role === 'admin' ? `
              <button onclick="window.App.navigate('admin')" class="btn btn-dark text-xs">
                <span class="material-symbols-outlined text-sm">admin_panel_settings</span> Open Admin Workspace
              </button>
            ` : ''}
            <button onclick="window.Auth.logout(); window.App.navigate('home');" class="btn btn-secondary text-xs">
              <span class="material-symbols-outlined text-sm">logout</span> Sign Out
            </button>
          </div>
        </div>

        <!-- Orders History Section -->
        <div class="space-y-4">
          <h2 class="font-headline-md text-xl text-primary dark:text-primary-fixed font-bold">Your Order History</h2>

          ${myOrders.length === 0 ? `
            <div class="p-8 rounded-xl bg-surface border border-outline-variant/30 text-center text-on-surface-variant">
              <span class="material-symbols-outlined text-4xl text-outline mb-2">history</span>
              <p>You have not placed any orders yet.</p>
              <button onclick="window.App.navigate('home')" class="btn btn-primary mt-4 text-xs">Start Shopping</button>
            </div>
          ` : `
            <div class="space-y-4">
              ${myOrders.map(order => this.renderOrderCard(order)).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  },

  renderOrderCard(order) {
    let paymentBadge = `<span class="badge badge-gold">Pending Approval</span>`;
    if (order.payment_status === 'approved') {
      paymentBadge = `<span class="badge badge-green">Payment Approved</span>`;
    } else if (order.payment_status === 'rejected') {
      paymentBadge = `<span class="badge badge-red">Payment Rejected</span>`;
    }

    return `
      <div class="p-6 rounded-2xl bg-surface border border-outline-variant/30 space-y-4 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
          <div>
            <span class="font-bold text-lg text-primary dark:text-primary-fixed">${order.order_number}</span>
            <span class="text-xs text-on-surface-variant ml-2">• ${new Date(order.created_at).toLocaleDateString()}</span>
          </div>
          <div class="flex items-center gap-2">
            ${paymentBadge}
            <span class="badge badge-blue">${order.order_status.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
        </div>

        <!-- Items Summary -->
        <div class="space-y-2">
          ${order.items.map(item => `
            <div class="flex justify-between text-sm text-on-surface">
              <span>${item.name} x ${item.quantity}</span>
              <span class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <div class="pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
          <div>
            <span>Payment Method: <strong>${order.payment_method}</strong></span>
            ${order.transaction_id ? `<span class="ml-2">Ref/UTR: <strong class="font-mono">${order.transaction_id}</strong></span>` : ''}
          </div>
          <div class="text-base font-bold text-primary dark:text-primary-fixed">
            Total Paid: $${order.total_amount.toFixed(2)}
          </div>
        </div>

        ${order.admin_notes ? `
          <div class="p-3 rounded-lg bg-surface-container-high text-xs text-on-surface border-l-4 border-secondary">
            <strong>Admin Note:</strong> ${order.admin_notes}
          </div>
        ` : ''}
      </div>
    `;
  }
};

/* ============================================================
   QUALITY GLASS EMPORIUM - CUSTOMER ACCOUNT WORKSPACE VIEW
   ============================================================ */

window.renderCustomerView = async function() {
  const store = window.appStore;
  const user = store.currentUser;

  if (!user) {
    store.navigateTo('login');
    return '';
  }

  const allOrders = await window.dbEngine.getOrders();
  const myOrders = allOrders.filter(o => o.customerEmail === user.email || o.userId === user.id);

  const getStatusBadge = function(status) {
    if (status === 'payment_review') return `<span class="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">Payment Pending Review</span>`;
    if (status === 'confirmed') return `<span class="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">Payment Approved</span>`;
    if (status === 'pending_payment') return `<span class="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold">Payment Rejected / Pending</span>`;
    if (status === 'shipped') return `<span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">Shipped</span>`;
    if (status === 'delivered') return `<span class="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-bold">Delivered</span>`;
    return `<span class="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-bold">${status}</span>`;
  };

  return `
    <div class="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <!-- Profile Header (Stitch user_account_dashboard_desktop) -->
      <div class="bg-primary text-white p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-secondary text-white text-2xl font-bold flex items-center justify-center border-2 border-white/20">
            ${user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 class="font-display-lg text-2xl font-bold text-white">${user.name}</h1>
            <div class="text-xs text-gray-300 font-mono">${user.email}</div>
            <div class="inline-block mt-1 bg-white/10 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
              ${user.role} Account
            </div>
          </div>
        </div>

        <button onclick="window.appStore.logout()" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
          Sign Out
        </button>
      </div>

      <!-- Order History List (Stitch user_account_order_history_desktop) -->
      <div class="bg-white dark:bg-charcoal-bg p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-sm">
        <div class="flex justify-between items-center pb-4 border-b border-gray-100">
          <h2 class="font-bold text-lg text-primary dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">history</span>
            My Order History (${myOrders.length})
          </h2>
        </div>

        ${myOrders.length > 0 ? `
          <div class="space-y-4">
            ${myOrders.map(ord => `
              <div class="p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4 hover:shadow-md transition-shadow">
                <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <div class="font-bold text-sm text-primary dark:text-white flex items-center gap-2">
                      <span>Order ${ord.orderNumber}</span>
                      <span class="text-xs text-subtle-gray font-normal">• ${new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="text-xs text-subtle-gray mt-0.5">Ship to: ${ord.shippingAddress}</div>
                  </div>
                  <div>
                    ${getStatusBadge(ord.status)}
                  </div>
                </div>

                <!-- Order items -->
                <div class="space-y-2">
                  ${ord.items.map(it => `
                    <div class="flex justify-between items-center text-xs">
                      <div class="font-medium text-gray-700 dark:text-gray-300">
                        ${it.productName} <span class="text-subtle-gray">x${it.quantity}</span>
                      </div>
                      <div class="font-bold">$${it.total.toFixed(2)}</div>
                    </div>
                  `).join('')}
                </div>

                <!-- Order total & payment receipt view -->
                <div class="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                  <div class="text-subtle-gray flex items-center gap-2">
                    <span>Total Amount: <strong class="text-primary dark:text-white font-bold">$${ord.totalAmount.toFixed(2)}</strong></span>
                    ${ord.payment && ord.payment.proofUrl ? `
                      <a href="${ord.payment.proofUrl}" target="_blank" class="text-secondary underline font-semibold">View Payment Proof</a>
                    ` : ''}
                  </div>
                  ${ord.status === 'pending_payment' ? `
                    <button onclick="window.appStore.navigateTo('checkout')" class="bg-secondary text-white px-3 py-1.5 rounded text-xs font-bold">
                      Upload New Payment Receipt
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-12 space-y-3">
            <span class="material-symbols-outlined text-4xl text-gray-300">receipt</span>
            <div class="text-sm font-bold text-gray-500">No orders placed yet</div>
            <button onclick="window.appStore.navigateTo('catalog')" class="bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold">
              Start Shopping
            </button>
          </div>
        `}
      </div>
    </div>
  `;
};

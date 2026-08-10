/* ============================================================
   QUALITY GLASS EMPORIUM - AUTHENTICATION & LOGIN VIEW
   ============================================================ */

window.renderLoginView = function() {
  const store = window.appStore;

  if (!window._authTab) window._authTab = 'signin';

  window.handleLoginSubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    const res = await store.login(email, password);
    if (!res.success) {
      alert(res.message);
    }
  };

  window.fillAdminCredentials = function(loginId) {
    document.getElementById('auth-email').value = loginId;
    document.getElementById('auth-pass').value = 'Vis6547@';
  };

  return `
    <div class="max-w-md mx-auto py-12 animate-fade-in">
      <div class="bg-white dark:bg-charcoal-bg rounded-2xl border border-outline-variant/30 p-8 space-y-6 shadow-xl">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-xl bg-primary text-white font-bold text-xl mx-auto flex items-center justify-center shadow-md">
            QGE
          </div>
          <h1 class="font-display-lg text-2xl font-bold text-primary dark:text-white">
            Sign In to Account
          </h1>
          <p class="text-xs text-subtle-gray">
            Quality Glass Emporium And Photo Framing Center
          </p>
        </div>

        <!-- Admin Seed Login Quick Shortcuts Box -->
        <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
          <div class="font-bold text-amber-900 flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">shield</span>
            Default Administrator Accounts:
          </div>
          <div class="grid grid-cols-2 gap-2 pt-1">
            <button type="button" onclick="fillAdminCredentials('@kaatya6547')" class="p-2 rounded bg-white text-left border border-amber-300 font-mono text-[11px] hover:bg-amber-100">
              <div><strong>Developer:</strong></div>
              <div>@kaatya6547</div>
            </button>
            <button type="button" onclick="fillAdminCredentials('@Ajmal6547')" class="p-2 rounded bg-white text-left border border-amber-300 font-mono text-[11px] hover:bg-amber-100">
              <div><strong>Owner:</strong></div>
              <div>@Ajmal6547</div>
            </button>
          </div>
        </div>

        <form onsubmit="window.handleLoginSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Email Address or Admin Login ID
            </label>
            <input id="auth-email" type="text" required placeholder="user@example.com or @kaatya6547" class="w-full p-3 text-sm rounded-lg border border-gray-300">
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input id="auth-pass" type="password" required placeholder="••••••••" class="w-full p-3 text-sm rounded-lg border border-gray-300">
          </div>

          <button type="submit" class="w-full bg-secondary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-secondary/90 shadow-md active:scale-95 transition-all">
            Sign In
          </button>
        </form>

        <div class="text-center text-xs text-subtle-gray pt-4 border-t border-gray-100">
          First time visitor? Log in with any customer email to automatically create a guest profile.
        </div>
      </div>
    </div>
  `;
};

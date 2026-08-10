/* ========================================================
   QUALITY GLASS EMPORIUM - AUTHENTICATION VIEWS (LOGIN & REGISTER)
   ======================================================== */

window.LoginView = {
  render() {
    return `
      <div class="max-w-md mx-auto py-8">
        <div class="p-8 rounded-2xl bg-surface border border-outline-variant/30 space-y-6 shadow-md">
          <div class="text-center space-y-2">
            <span class="badge badge-gold">Account Access</span>
            <h1 class="font-headline-lg text-2xl text-primary dark:text-primary-fixed font-bold">Sign In to Your Account</h1>
            <p class="text-xs text-on-surface-variant">Log in as customer or administrator to manage orders & storefront.</p>
          </div>

          <!-- Quick Seed Credentials Note for User Convenience -->
          <div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-[11px] space-y-1">
            <div class="font-bold text-primary">Default Admin Test Credentials:</div>
            <div>Developer: <code class="font-mono text-secondary">@kaatya6547</code> / Pass: <code class="font-mono">Vis6547@</code></div>
            <div>Owner: <code class="font-mono text-secondary">@Ajmal6547</code> / Pass: <code class="font-mono">Vis6547@</code></div>
          </div>

          <form id="login-form" onsubmit="window.LoginView.handleLogin(event)" class="space-y-4 text-xs">
            <div>
              <label class="font-semibold block mb-1 text-on-surface">Username / Handle / Email *</label>
              <input type="text" id="login-id" required placeholder="@kaatya6547 or email" class="input-field py-2.5 text-xs">
            </div>

            <div>
              <label class="font-semibold block mb-1 text-on-surface">Password *</label>
              <input type="password" id="login-pass" required placeholder="••••••••" class="input-field py-2.5 text-xs">
            </div>

            <button type="submit" class="btn btn-primary w-full py-3 text-sm">
              Sign In <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

          <div class="text-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
            Don't have a customer account yet?
            <a href="#" onclick="window.App.navigate('register')" class="text-secondary font-bold hover:underline ml-1">Create Customer Account</a>
          </div>
        </div>
      </div>
    `;
  },

  handleLogin(event) {
    event.preventDefault();
    const id = document.getElementById("login-id").value.trim();
    const pass = document.getElementById("login-pass").value;

    const res = window.Auth.login(id, pass);
    if (res.success) {
      alert(`Welcome back, ${res.user.displayName}!`);
      if (res.user.role === 'admin') {
        window.App.navigate('admin-dashboard');
      } else {
        window.App.navigate('account-dashboard');
      }
    } else {
      alert(res.message);
    }
  }
};

window.RegisterView = {
  render() {
    return `
      <div class="max-w-md mx-auto py-8">
        <div class="p-8 rounded-2xl bg-surface border border-outline-variant/30 space-y-6 shadow-md">
          <div class="text-center space-y-2">
            <span class="badge badge-blue">New Registration</span>
            <h1 class="font-headline-lg text-2xl text-primary dark:text-primary-fixed font-bold">Create Customer Account</h1>
            <p class="text-xs text-on-surface-variant">Register to track custom framing orders and upload payment proofs.</p>
          </div>

          <form id="register-form" onsubmit="window.RegisterView.handleRegister(event)" class="space-y-4 text-xs">
            <div>
              <label class="font-semibold block mb-1 text-on-surface">Full Name *</label>
              <input type="text" id="reg-name" required placeholder="John Doe" class="input-field py-2.5 text-xs">
            </div>

            <div>
              <label class="font-semibold block mb-1 text-on-surface">Username / Handle *</label>
              <input type="text" id="reg-user" required placeholder="@johndoe" class="input-field py-2.5 text-xs">
            </div>

            <div>
              <label class="font-semibold block mb-1 text-on-surface">Email Address *</label>
              <input type="email" id="reg-email" required placeholder="john@example.com" class="input-field py-2.5 text-xs">
            </div>

            <div>
              <label class="font-semibold block mb-1 text-on-surface">Create Password *</label>
              <input type="password" id="reg-pass" required placeholder="••••••••" class="input-field py-2.5 text-xs">
            </div>

            <button type="submit" class="btn btn-primary w-full py-3 text-sm">
              Create Customer Account <span class="material-symbols-outlined text-sm">person_add</span>
            </button>
          </form>

          <div class="text-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
            Already registered?
            <a href="#" onclick="window.App.navigate('login')" class="text-secondary font-bold hover:underline ml-1">Sign In</a>
          </div>
        </div>
      </div>
    `;
  },

  handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const user = document.getElementById("reg-user").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-pass").value;

    const res = window.Auth.registerCustomer(user, name, email, pass);
    if (res.success) {
      alert("Customer account created successfully!");
      window.App.navigate('account-dashboard');
    } else {
      alert(res.message);
    }
  }
};

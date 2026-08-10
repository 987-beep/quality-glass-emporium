/* ========================================================
   QUALITY GLASS EMPORIUM - AUTHENTICATION & RBAC
   ======================================================== */

window.Auth = {
  CURRENT_USER_KEY: "qg_active_user",
  REGISTERED_USERS_KEY: "qg_registered_users",

  init() {
    this.seedDefaultAdminAccounts();
  },

  seedDefaultAdminAccounts() {
    let users = this.getUsers();
    
    window.APP_CONFIG.SEED_ADMINS.forEach(admin => {
      const exists = users.some(u => u.username.toLowerCase() === admin.username.toLowerCase());
      if (!exists) {
        users.push({
          id: admin.id,
          username: admin.username,
          displayName: admin.displayName,
          email: admin.email,
          role: "admin",
          password: admin.password,
          created_at: new Date().toISOString()
        });
      }
    });

    localStorage.setItem(this.REGISTERED_USERS_KEY, JSON.stringify(users));
  },

  getUsers() {
    try {
      const data = localStorage.getItem(this.REGISTERED_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "admin";
  },

  login(identifier, password) {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();

    // Match by username (e.g. @kaatya6547) or email (e.g. kaatya6547@qualityemporium.local)
    const foundUser = users.find(u => 
      u.username.toLowerCase() === cleanId || 
      (u.username.startsWith("@") && u.username.toLowerCase() === "@" + cleanId) ||
      u.email.toLowerCase() === cleanId
    );

    if (!foundUser) {
      return { success: false, message: "Invalid username or password." };
    }

    if (foundUser.password !== password) {
      return { success: false, message: "Invalid username or password." };
    }

    // Omit sensitive data before storing active session
    const activeSession = {
      id: foundUser.id,
      username: foundUser.username,
      displayName: foundUser.displayName,
      email: foundUser.email,
      role: foundUser.role
    };

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(activeSession));
    window.dispatchEvent(new CustomEvent("auth_state_changed", { detail: activeSession }));

    return { success: true, user: activeSession };
  },

  registerCustomer(username, displayName, email, password) {
    let users = this.getUsers();
    const cleanUsername = username.trim().startsWith("@") ? username.trim() : "@" + username.trim();
    
    if (users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase() || u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "An account with this username or email already exists." };
    }

    // STRICT REQUIRMENT 6 & 12: Public registration ONLY creates 'customer' role.
    const newCustomer = {
      id: "usr_" + Date.now(),
      username: cleanUsername,
      displayName: displayName,
      email: email,
      role: "customer",
      password: password,
      created_at: new Date().toISOString()
    };

    users.push(newCustomer);
    localStorage.setItem(this.REGISTERED_USERS_KEY, JSON.stringify(users));

    // Auto login as customer
    const activeSession = {
      id: newCustomer.id,
      username: newCustomer.username,
      displayName: newCustomer.displayName,
      email: newCustomer.email,
      role: newCustomer.role
    };

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(activeSession));
    window.dispatchEvent(new CustomEvent("auth_state_changed", { detail: activeSession }));

    return { success: true, user: activeSession };
  },

  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    window.dispatchEvent(new CustomEvent("auth_state_changed", { detail: null }));
  }
};

window.Auth.init();

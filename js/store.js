/* ============================================================
   QUALITY GLASS EMPORIUM - CENTRAL APP STORE & REACTIVITY ENGINE
   ============================================================ */

class AppStore {
  constructor() {
    this.currentView = 'home';
    this.viewParams = {};
    this.adminSubTab = 'dashboard';
    
    // Auth State
    this.currentUser = JSON.parse(localStorage.getItem('qge_user')) || null; // null means guest
    
    // Cart State
    this.cart = JSON.parse(localStorage.getItem('qge_cart')) || [];
    this.appliedCoupon = JSON.parse(localStorage.getItem('qge_coupon')) || null;
    
    // Filter & Search State
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.sortBy = 'featured';

    // Toast state
    this.toast = null;

    // Listeners for view re-rendering
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- NAVIGATION ---
  navigateTo(viewName, params = {}) {
    this.currentView = viewName;
    this.viewParams = params;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  setAdminSubTab(tabName) {
    this.adminSubTab = tabName;
    this.notify();
  }

  // --- AUTHENTICATION ---
  async login(emailOrLoginId, password) {
    // Check default admin seed login IDs first
    if (emailOrLoginId === '@kaatya6547' || emailOrLoginId === 'kaatya6547@qualityglass.internal') {
      if (password === 'Vis6547@') {
        this.currentUser = {
          id: 'admin-1',
          name: 'Developer',
          email: 'kaatya6547@qualityglass.internal',
          loginId: '@kaatya6547',
          role: 'admin'
        };
        localStorage.setItem('qge_user', JSON.stringify(this.currentUser));
        this.showToast('Logged in as Developer Admin', 'success');
        this.navigateTo('admin');
        return { success: true };
      } else {
        return { success: false, message: 'Invalid password for Developer account.' };
      }
    }

    if (emailOrLoginId === '@Ajmal6547' || emailOrLoginId === 'ajmal6547@qualityglass.internal') {
      if (password === 'Vis6547@') {
        this.currentUser = {
          id: 'admin-2',
          name: 'Owner',
          email: 'ajmal6547@qualityglass.internal',
          loginId: '@Ajmal6547',
          role: 'admin'
        };
        localStorage.setItem('qge_user', JSON.stringify(this.currentUser));
        this.showToast('Logged in as Owner Admin', 'success');
        this.navigateTo('admin');
        return { success: true };
      } else {
        return { success: false, message: 'Invalid password for Owner account.' };
      }
    }

    // Standard Customer authentication
    this.currentUser = {
      id: 'cust-' + Date.now(),
      name: emailOrLoginId.split('@')[0] || 'Customer User',
      email: emailOrLoginId,
      role: 'customer'
    };
    localStorage.setItem('qge_user', JSON.stringify(this.currentUser));
    this.showToast('Logged in successfully', 'success');
    this.navigateTo('customer');
    return { success: true };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('qge_user');
    this.showToast('Logged out successfully', 'info');
    this.navigateTo('home');
  }

  // --- CART MANAGEMENT ---
  addToCart(product, quantity = 1, options = {}) {
    const existingIndex = this.cart.findIndex(item => item.product.id === product.id && JSON.stringify(item.options) === JSON.stringify(options));
    
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: 'cart-item-' + Date.now() + Math.random().toString(36).substr(2, 4),
        product,
        quantity,
        options
      });
    }

    this.saveCart();
    this.showToast(`Added "${product.name}" to shopping cart!`, 'success');
    this.notify();
  }

  updateCartQuantity(cartItemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }

    const item = this.cart.find(i => i.id === cartItemId);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
      this.notify();
    }
  }

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter(i => i.id !== cartItemId);
    this.saveCart();
    this.showToast('Item removed from cart', 'info');
    this.notify();
  }

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    localStorage.removeItem('qge_cart');
    localStorage.removeItem('qge_coupon');
    this.notify();
  }

  saveCart() {
    localStorage.setItem('qge_cart', JSON.stringify(this.cart));
  }

  applyCoupon(code) {
    const coupons = window.SEED_DATA.coupons;
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    
    if (!found) {
      this.showToast('Invalid coupon code', 'error');
      return false;
    }

    const subtotal = this.getCartSubtotal();
    if (subtotal < found.minSpend) {
      this.showToast(`Coupon requires minimum spend of $${found.minSpend.toFixed(2)}`, 'error');
      return false;
    }

    this.appliedCoupon = found;
    localStorage.setItem('qge_coupon', JSON.stringify(found));
    this.showToast(`Coupon "${found.code}" applied!`, 'success');
    this.notify();
    return true;
  }

  removeCoupon() {
    this.appliedCoupon = null;
    localStorage.removeItem('qge_coupon');
    this.showToast('Coupon removed', 'info');
    this.notify();
  }

  // --- CALCULATIONS ---
  getCartSubtotal() {
    return this.cart.reduce((sum, item) => {
      const p = item.product.salePrice || item.product.price;
      return sum + (p * item.quantity);
    }, 0);
  }

  getDiscountAmount() {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.getCartSubtotal();
    if (this.appliedCoupon.type === 'percentage') {
      return (subtotal * this.appliedCoupon.value) / 100;
    }
    return Math.min(subtotal, this.appliedCoupon.value);
  }

  getShippingAmount() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0 || subtotal >= window.APP_CONFIG.FREE_SHIPPING_MIN) {
      return 0;
    }
    return window.APP_CONFIG.SHIPPING_FLAT_FEE;
  }

  getTaxAmount() {
    const subtotal = this.getCartSubtotal();
    const discount = this.getDiscountAmount();
    return (subtotal - discount) * window.APP_CONFIG.TAX_RATE;
  }

  getCartTotal() {
    const subtotal = this.getCartSubtotal();
    const discount = this.getDiscountAmount();
    const shipping = this.getShippingAmount();
    const tax = this.getTaxAmount();
    return Math.max(0, subtotal - discount + shipping + tax);
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = 'info') {
    this.toast = { message, type, id: Date.now() };
    this.notify();
    setTimeout(() => {
      if (this.toast && this.toast.id === this.toast.id) {
        this.toast = null;
        this.notify();
      }
    }, 3500);
  }
}

window.appStore = new AppStore();

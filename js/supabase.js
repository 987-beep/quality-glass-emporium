/* ============================================================
   QUALITY GLASS EMPORIUM - SUPABASE & DATABASE PERSISTENCE ENGINE
   ============================================================ */

class DatabaseEngine {
  constructor() {
    this.storageKey = 'qge_db_store_v1';
    this.initLocalStore();
  }

  initLocalStore() {
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      this.db = {
        products: JSON.parse(JSON.stringify(window.SEED_DATA.products)),
        categories: JSON.parse(JSON.stringify(window.SEED_DATA.categories)),
        banners: JSON.parse(JSON.stringify(window.SEED_DATA.banners)),
        coupons: JSON.parse(JSON.stringify(window.SEED_DATA.coupons)),
        reviews: JSON.parse(JSON.stringify(window.SEED_DATA.reviews)),
        siteSettings: JSON.parse(JSON.stringify(window.SEED_DATA.siteSettings)),
        cmsPages: JSON.parse(JSON.stringify(window.SEED_DATA.cmsPages)),
        paymentGateways: JSON.parse(JSON.stringify(window.SEED_DATA.paymentGateways)),
        orders: [
          {
            id: 'ord-1001',
            orderNumber: 'QGE-2026-1001',
            userId: 'usr-1',
            customerName: 'Aarav Sharma',
            customerEmail: 'aarav@example.com',
            customerPhone: '+91-9876543210',
            shippingAddress: 'PNT Colony, Raebareli, UP',
            status: 'payment_review',
            subtotal: 45.00,
            shippingFee: 50.00,
            taxAmount: 2.25,
            discountAmount: 0.00,
            totalAmount: 97.25,
            items: [
              { productId: 'prod-1', productName: 'Gallery Standard Black', price: 45.00, quantity: 1, total: 45.00 }
            ],
            payment: {
              paymentMethod: 'upi',
              paymentStatus: 'pending',
              proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
              amount: 97.25,
              transactionRef: 'UPI/9812739182/RAEBARELI',
              createdAt: new Date().toISOString()
            },
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          }
        ],
        payments: [
          {
            id: 'pay-1001',
            orderId: 'ord-1001',
            orderNumber: 'QGE-2026-1001',
            customerName: 'Aarav Sharma',
            amount: 97.25,
            paymentMethod: 'upi',
            paymentStatus: 'pending',
            proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          }
        ],
        customers: [
          { id: 'usr-1', name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91-9876543210', ordersCount: 1, totalSpent: 97.25 }
        ],
        auditLogs: [
          { id: 'log-1', adminName: 'Developer (@kaatya6547)', action: 'System Initialization', entityType: 'System', details: 'Database engine booted and seeded.', timestamp: new Date().toISOString() }
        ]
      };
      this.saveLocalStore();
    } else {
      try {
        this.db = JSON.parse(existing);
      } catch (e) {
        console.error('Failed to parse local store, re-initializing', e);
        localStorage.removeItem(this.storageKey);
        this.initLocalStore();
      }
    }
  }

  saveLocalStore() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.db));
  }

  // --- PRODUCTS ---
  async getProducts() {
    return this.db.products;
  }

  async saveProduct(productData) {
    if (productData.id) {
      const idx = this.db.products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        this.db.products[idx] = { ...this.db.products[idx], ...productData };
      }
    } else {
      const newProd = {
        id: 'prod-' + Date.now(),
        slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        rating: 5.0,
        reviewsCount: 0,
        ...productData
      };
      this.db.products.unshift(newProd);
    }
    this.saveLocalStore();
    this.addAuditLog('Save Product', 'Product', productData.name);
    return true;
  }

  async deleteProduct(productId) {
    this.db.products = this.db.products.filter(p => p.id !== productId);
    this.saveLocalStore();
    this.addAuditLog('Delete Product', 'Product', productId);
    return true;
  }

  // --- CATEGORIES ---
  async getCategories() {
    return this.db.categories;
  }

  async saveCategory(categoryData) {
    if (categoryData.id) {
      const idx = this.db.categories.findIndex(c => c.id === categoryData.id);
      if (idx !== -1) this.db.categories[idx] = { ...this.db.categories[idx], ...categoryData };
    } else {
      categoryData.id = 'cat-' + Date.now();
      categoryData.slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      this.db.categories.push(categoryData);
    }
    this.saveLocalStore();
    this.addAuditLog('Save Category', 'Category', categoryData.name);
    return true;
  }

  // --- ORDERS & PAYMENTS ---
  async getOrders() {
    return this.db.orders;
  }

  async createOrder(orderPayload) {
    const orderId = 'ord-' + Date.now();
    const orderNumber = 'QGE-2026-' + Math.floor(1000 + Math.random() * 9000);
    
    const newOrder = {
      id: orderId,
      orderNumber: orderNumber,
      createdAt: new Date().toISOString(),
      status: 'payment_review',
      ...orderPayload,
      payment: {
        paymentMethod: orderPayload.paymentMethod,
        paymentStatus: 'pending',
        proofUrl: orderPayload.proofUrl,
        amount: orderPayload.totalAmount,
        createdAt: new Date().toISOString()
      }
    };

    const newPayment = {
      id: 'pay-' + Date.now(),
      orderId: orderId,
      orderNumber: orderNumber,
      customerName: orderPayload.customerName,
      amount: orderPayload.totalAmount,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: 'pending',
      proofUrl: orderPayload.proofUrl,
      createdAt: new Date().toISOString()
    };

    this.db.orders.unshift(newOrder);
    this.db.payments.unshift(newPayment);
    this.saveLocalStore();
    return newOrder;
  }

  async updateOrderStatus(orderId, newStatus) {
    const order = this.db.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.saveLocalStore();
      this.addAuditLog('Update Order Status', 'Order', `${order.orderNumber} -> ${newStatus}`);
    }
    return true;
  }

  async approvePayment(paymentId, adminNotes = '') {
    const pay = this.db.payments.find(p => p.id === paymentId);
    if (pay) {
      pay.paymentStatus = 'approved';
      pay.adminNotes = adminNotes;
      pay.reviewedAt = new Date().toISOString();

      const order = this.db.orders.find(o => o.id === pay.orderId);
      if (order) {
        order.status = 'confirmed';
        if (order.payment) {
          order.payment.paymentStatus = 'approved';
        }
      }
      this.saveLocalStore();
      this.addAuditLog('Approve Payment', 'Payment', pay.orderNumber);
    }
    return true;
  }

  async rejectPayment(paymentId, adminNotes = '') {
    const pay = this.db.payments.find(p => p.id === paymentId);
    if (pay) {
      pay.paymentStatus = 'rejected';
      pay.adminNotes = adminNotes;
      pay.reviewedAt = new Date().toISOString();

      const order = this.db.orders.find(o => o.id === pay.orderId);
      if (order) {
        order.status = 'pending_payment';
        if (order.payment) {
          order.payment.paymentStatus = 'rejected';
        }
      }
      this.saveLocalStore();
      this.addAuditLog('Reject Payment', 'Payment', pay.orderNumber);
    }
    return true;
  }

  // --- BANNERS ---
  async getBanners() {
    return this.db.banners;
  }

  async saveBanner(bannerData) {
    if (bannerData.id) {
      const idx = this.db.banners.findIndex(b => b.id === bannerData.id);
      if (idx !== -1) this.db.banners[idx] = { ...this.db.banners[idx], ...bannerData };
    } else {
      bannerData.id = 'ban-' + Date.now();
      this.db.banners.push(bannerData);
    }
    this.saveLocalStore();
    this.addAuditLog('Save Banner', 'Banner', bannerData.title);
    return true;
  }

  // --- SITE SETTINGS ---
  async getSiteSettings() {
    return this.db.siteSettings;
  }

  async saveSiteSettings(settings) {
    this.db.siteSettings = { ...this.db.siteSettings, ...settings };
    this.saveLocalStore();
    this.addAuditLog('Update Store Settings', 'Settings', 'Updated store configuration');
    return true;
  }

  // --- REVIEWS ---
  async getReviews() {
    return this.db.reviews;
  }

  async addReview(reviewData) {
    const newRev = {
      id: 'rev-' + Date.now(),
      status: 'approved',
      createdAt: new Date().toISOString().split('T')[0],
      ...reviewData
    };
    this.db.reviews.unshift(newRev);
    this.saveLocalStore();
    return newRev;
  }

  // --- COUPONS ---
  async getCoupons() {
    return this.db.coupons;
  }

  async saveCoupon(couponData) {
    if (couponData.id) {
      const idx = this.db.coupons.findIndex(c => c.id === couponData.id);
      if (idx !== -1) this.db.coupons[idx] = { ...this.db.coupons[idx], ...couponData };
    } else {
      couponData.id = 'coup-' + Date.now();
      this.db.coupons.push(couponData);
    }
    this.saveLocalStore();
    this.addAuditLog('Save Coupon', 'Coupon', couponData.code);
    return true;
  }

  // --- AUDIT LOGS ---
  addAuditLog(action, entityType, details) {
    const currentUser = window.appStore ? window.appStore.currentUser : null;
    const adminName = currentUser ? `${currentUser.name} (${currentUser.loginId || currentUser.email})` : 'System Admin';
    this.db.auditLogs.unshift({
      id: 'log-' + Date.now(),
      adminName,
      action,
      entityType,
      details,
      timestamp: new Date().toISOString()
    });
    if (this.db.auditLogs.length > 100) this.db.auditLogs.pop();
    this.saveLocalStore();
  }

  async getAuditLogs() {
    return this.db.auditLogs;
  }
}

window.dbEngine = new DatabaseEngine();

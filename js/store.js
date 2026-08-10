/* ========================================================
   QUALITY GLASS EMPORIUM - DATA STORE MANAGEMENT
   ======================================================== */

window.Store = {
  // State Storage Keys
  STORAGE_KEYS: {
    PRODUCTS: "qg_store_products",
    CATEGORIES: "qg_store_categories",
    CART: "qg_store_cart",
    ORDERS: "qg_store_orders",
    PAYMENT_PROOFS: "qg_store_payment_proofs",
    BANNERS: "qg_store_banners",
    SETTINGS: "qg_store_settings",
    COUPONS: "qg_store_coupons",
    REVIEWS: "qg_store_reviews",
    AUDIT_LOGS: "qg_store_audit_logs",
    CURRENT_USER: "qg_current_user"
  },

  init() {
    this.seedInitialDataIfEmpty();
  },

  // Persistent Helpers
  getItem(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("LocalStorage write error", e);
    }
  },

  // Seed default data if LocalStorage is unpopulated
  seedInitialDataIfEmpty() {
    if (!localStorage.getItem(this.STORAGE_KEYS.PRODUCTS)) {
      const defaultCategories = [
        { id: "c1", name: "Custom Photo Framing", slug: "custom-photo-framing", description: "Artisanal handcrafted frames for memories, paintings & certificates.", display_order: 1 },
        { id: "c2", name: "Museum & Non-Reflective Glass", slug: "museum-glass", description: "99% UV protection anti-glare crystal glass for art preservation.", display_order: 2 },
        { id: "c3", name: "Modern Acrylic Float", slug: "acrylic-float", description: "Edge-to-edge frameless acrylic floating mounting panels.", display_order: 3 },
        { id: "c4", name: "Toughened Architectural Glass", slug: "toughened-glass", description: "High-durability safety glass panels for partitions.", display_order: 4 },
        { id: "c5", name: "Designer Mirror Solutions", slug: "designer-mirrors", description: "Beveled edge LED and antique decorative wall mirrors.", display_order: 5 }
      ];

      const defaultProducts = [
        {
          id: "p1",
          name: "Gallery Standard Black Frame",
          slug: "gallery-standard-black-frame",
          description: "Solid Burmese teak wood frame with matte black finish and 99% clear protective glass pane.",
          price: 45.00,
          sale_price: 39.99,
          sku: "QG-BLK-1218",
          stock_quantity: 50,
          category_id: "c1",
          is_published: true,
          is_featured: true,
          images: [
            "https://lh3.googleusercontent.com/aida/AP1WRLvpj_DBm0YS_Ppvo1h7J-YfBfbITEim0H_qba03K0N4W7inBIA-tDzfpmtQv46au_EMH2ftjaq4KoM3Rg0tC18eXw7LFlhFhb2zndlbO-yd1wXuAlHwmyUTv-jB12V0158KK7J75E99ctXxxKJtziAx-sciGjXh3ttHQ--Eo3KhqpHoQEndXkl4noF8itbSHysBOhzLN5rEXx0TjerJG0WA4s-LoJMJ4UKoRYpD8YbK4jCY6zPviIq5vhTi"
          ]
        },
        {
          id: "p2",
          name: "Modern Acrylic Float Panel 16x24",
          slug: "modern-acrylic-float-panel-16x24",
          description: "Frameless edge-to-edge optical clarity acrylic panel with stainless steel standoffs.",
          price: 65.00,
          sale_price: 59.00,
          sku: "QG-ACR-1624",
          stock_quantity: 35,
          category_id: "c3",
          is_published: true,
          is_featured: true,
          images: [
            "https://lh3.googleusercontent.com/aida/AP1WRLs8jKR2nyRO8MEitgNunFVxUxXaf49IM93RjH08aG3jumiYkzVAz9aeiFEFDEp7aoFQhu54fONCjpISdaML3v0f5aEzYgtqjPdaz72DDT_Hyx-DVSXj83hQKJmFYibuNAeMoAhwPjxopwh0UFpsm0l8-hyefplGjGv7kbPsQfey6RnI2ckMMdAuK5MYaacgsU3dcHEfbvq0Yr4JuKjIyJgZho9ClLTXDmEVKe6ewitBXxyMs3-yq849WSgD"
          ]
        },
        {
          id: "p3",
          name: "Museum Grade Anti-Reflective UV Glass Sheet",
          slug: "museum-grade-anti-reflective-uv-glass",
          description: "Ultra-pure low-iron anti-reflective glass designed to prevent glare and protect against UV fading.",
          price: 85.00,
          sale_price: 75.00,
          sku: "QG-MUS-UVGL",
          stock_quantity: 100,
          category_id: "c2",
          is_published: true,
          is_featured: true,
          images: [
            "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
          ]
        },
        {
          id: "p4",
          name: "Royal Teak Gold Leaf Carved Mirror Frame",
          slug: "royal-teak-gold-leaf-carved-mirror-frame",
          description: "Hand-carved premium hardwood frame embellished with fine metallic gold accents.",
          price: 120.00,
          sale_price: 105.00,
          sku: "QG-MIR-GOLD",
          stock_quantity: 15,
          category_id: "c5",
          is_published: true,
          is_featured: true,
          images: [
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
          ]
        }
      ];

      const defaultBanners = [
        {
          id: "b1",
          title: "Frame Your Memories in Perfect Clarity",
          subtitle: "Discover our curated collection of premium glass and acrylic frames, custom crafted in Raebareli.",
          image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
          link_url: "#collections",
          is_active: true
        },
        {
          id: "b2",
          title: "Museum-Grade Conservation Glass",
          subtitle: "99% UV radiation blocking with non-reflective optical finish for heirloom artwork.",
          image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
          link_url: "#museum-glass",
          is_active: true
        }
      ];

      const defaultSettings = {
        store_name: "Quality Glass Emporium And Photo Framing Center",
        phone: "+91 98765 43210",
        email: "contact@qualityglass.in",
        address: "Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh",
        opening_hours: "Open daily until 9:00 PM (4.9 Stars - 8 Ratings)",
        tax_rate: 18.0,
        shipping_fee: 15.0,
        free_shipping_min: 150.0
      };

      const defaultCoupons = [
        { id: "cp1", code: "WELCOME10", discount_type: "percentage", discount_value: 10, min_order: 50, is_active: true },
        { id: "cp2", code: "RAEBARELI15", discount_type: "fixed", discount_value: 15, min_order: 100, is_active: true }
      ];

      this.setItem(this.STORAGE_KEYS.CATEGORIES, defaultCategories);
      this.setItem(this.STORAGE_KEYS.PRODUCTS, defaultProducts);
      this.setItem(this.STORAGE_KEYS.BANNERS, defaultBanners);
      this.setItem(this.STORAGE_KEYS.SETTINGS, defaultSettings);
      this.setItem(this.STORAGE_KEYS.COUPONS, defaultCoupons);
      this.setItem(this.STORAGE_KEYS.CART, []);
      this.setItem(this.STORAGE_KEYS.ORDERS, []);
      this.setItem(this.STORAGE_KEYS.REVIEWS, []);
      this.setItem(this.STORAGE_KEYS.AUDIT_LOGS, []);
    }
  },

  // Cart Handlers
  getCart() {
    return this.getItem(this.STORAGE_KEYS.CART, []);
  },

  addToCart(productId, quantity = 1) {
    const cart = this.getCart();
    const products = this.getItem(this.STORAGE_KEYS.PRODUCTS);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.product_id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        product_id: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image: product.images ? product.images[0] : "",
        sku: product.sku,
        quantity: quantity
      });
    }
    this.setItem(this.STORAGE_KEYS.CART, cart);
    window.dispatchEvent(new CustomEvent("cart_updated"));
  },

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.product_id !== productId);
    this.setItem(this.STORAGE_KEYS.CART, cart);
    window.dispatchEvent(new CustomEvent("cart_updated"));
  },

  updateCartQuantity(productId, quantity) {
    let cart = this.getCart();
    const index = cart.findIndex(item => item.product_id === productId);
    if (index > -1) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
      this.setItem(this.STORAGE_KEYS.CART, cart);
      window.dispatchEvent(new CustomEvent("cart_updated"));
    }
  },

  clearCart() {
    this.setItem(this.STORAGE_KEYS.CART, []);
    window.dispatchEvent(new CustomEvent("cart_updated"));
  },

  // Order Handlers
  createOrder(orderData) {
    const orders = this.getItem(this.STORAGE_KEYS.ORDERS, []);
    const orderNumber = "QG-ORD-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: "ord_" + Date.now(),
      order_number: orderNumber,
      user_id: orderData.user_id || "guest",
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      shipping_address: orderData.shipping_address,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount_amount: orderData.discount_amount || 0,
      shipping_fee: orderData.shipping_fee || 0,
      tax_amount: orderData.tax_amount || 0,
      total_amount: orderData.total_amount,
      order_status: "pending_payment_approval",
      payment_status: "pending",
      payment_method: orderData.payment_method || "Bank Transfer / UPI",
      payment_proof: orderData.payment_proof || null,
      transaction_id: orderData.transaction_id || null,
      created_at: new Date().toISOString()
    };

    orders.unshift(newOrder);
    this.setItem(this.STORAGE_KEYS.ORDERS, orders);
    this.clearCart();
    return newOrder;
  },

  // Payment Proof Approval Handler
  updateOrderPaymentStatus(orderId, paymentStatus, orderStatus, reviewNote = "", adminName = "Admin") {
    const orders = this.getItem(this.STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      orders[index].payment_status = paymentStatus; // 'approved' or 'rejected'
      orders[index].order_status = orderStatus;    // 'confirmed' or 'payment_rejected'
      orders[index].admin_notes = reviewNote;
      orders[index].updated_at = new Date().toISOString();
      this.setItem(this.STORAGE_KEYS.ORDERS, orders);

      // Add audit log
      this.addAuditLog(adminName, `Payment ${paymentStatus.toUpperCase()} for Order ${orders[index].order_number}`, "Order", orderId);
      return orders[index];
    }
    return null;
  },

  // Audit Log Handler
  addAuditLog(adminName, action, entity, entityId) {
    const logs = this.getItem(this.STORAGE_KEYS.AUDIT_LOGS, []);
    logs.unshift({
      id: "log_" + Date.now(),
      admin_username: adminName,
      action: action,
      entity: entity,
      entity_id: entityId,
      timestamp: new Date().toISOString()
    });
    this.setItem(this.STORAGE_KEYS.AUDIT_LOGS, logs);
  }
};

window.Store.init();

import { 
  Product, Category, Order, Banner, Coupon, Review, SiteSettings, AdminAuditLog, CartItem
} from '../types/database';
import { 
  SEED_PRODUCTS, SEED_CATEGORIES, SEED_BANNERS, SEED_COUPONS, SEED_SITE_SETTINGS, SEED_ADMINS 
} from '../seed-data';

// In-Memory Persistent Data Cache for Storefront & Admin Operations
let productsCache: Product[] = [...SEED_PRODUCTS];
let categoriesCache: Category[] = [...SEED_CATEGORIES];
let bannersCache: Banner[] = [...SEED_BANNERS];
let couponsCache: Coupon[] = [...SEED_COUPONS];
let siteSettingsCache: SiteSettings = { ...SEED_SITE_SETTINGS };
let reviewsCache: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    user_name: 'Anita Verma',
    rating: 5,
    comment: 'Exceptional glass clarity and beautiful black frame finish. Fast delivery in Raebareli!',
    is_approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'rev-2',
    product_id: 'prod-3',
    user_name: 'Rahul Sharma',
    rating: 5,
    comment: 'The dark oak wood frame was custom cut perfectly for my canvas painting. Highly recommend Quality Glass Emporium.',
    is_approved: true,
    created_at: new Date().toISOString()
  }
];

let ordersCache: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'ORD-2024-081',
    user_id: 'usr-1',
    customer_name: 'Elena Schmidt',
    customer_email: 'elena@example.com',
    customer_phone: '+91 98765 43210',
    shipping_address: {
      full_name: 'Elena Schmidt',
      street: '1042 Hill House Lane',
      city: 'Raebareli',
      state: 'Uttar Pradesh',
      postal_code: '229001',
      country: 'India',
      phone: '+91 98765 43210'
    },
    subtotal: 323.00,
    shipping_cost: 25.00,
    tax_amount: 25.84,
    discount_amount: 0,
    total_amount: 373.84,
    status: 'pending_payment',
    payment_method: 'bank_transfer',
    payment_proof_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn9jcbQoercOVYC4cIh6sCAq0SxYrV3HTIG5W3auYxzruTW8aRjwyY9luCnMxd28yoZnXhUFBPMldk8q3706QN7G0Pk6NvVMUpejdxd5-v2PjYZdCm-7smpDuUE90xvPQImJ7H7u3U_0YX_aw-hZP4I6EZDhGbzlnJE19BBuNwFt3rv5ke7ncQMQzxZ_krIUmzg6ygnPxUuERNB0jKtFfWfRUhXRr7YMl63PGTGeyW8WI_sPF-D0Ok0w',
    payment_notes: 'Uploaded bank deposit receipt for verification.',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        id: 'item-1',
        order_id: 'ord-1001',
        product_id: 'prod-4',
        product_name: 'Museum Grade Acrylic Sheet Front',
        product_price: 145.00,
        quantity: 1,
        custom_config: { width: 24, height: 36 },
        subtotal: 145.00
      },
      {
        id: 'item-2',
        order_id: 'ord-1001',
        product_id: 'prod-5',
        product_name: 'Walnut Gallery Frame',
        product_price: 89.00,
        quantity: 2,
        subtotal: 178.00
      }
    ]
  },
  {
    id: 'ord-1002',
    order_number: 'ORD-2024-080',
    user_id: 'usr-2',
    customer_name: 'James Davies',
    customer_email: 'james@example.com',
    customer_phone: '+91 91234 56789',
    shipping_address: {
      full_name: 'James Davies',
      street: '45 Civil Lines Road',
      city: 'Raebareli',
      state: 'Uttar Pradesh',
      postal_code: '229001',
      country: 'India',
      phone: '+91 91234 56789'
    },
    subtotal: 1250.00,
    shipping_cost: 0,
    tax_amount: 225.00,
    discount_amount: 0,
    total_amount: 1475.00,
    status: 'payment_approved',
    payment_method: 'bank_transfer',
    payment_proof_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC06dOELKuBMw9m6GZn5CE55rRfCOvbhcIVX1YX5e1nx_AYd2xRpib42ruUborA1mo_sbCndJhISNYqNc9MX9nmZex141BFB86_vxmdoMbvkX7aDJKd2urysbIq4OzFpO7l4KJm5s7IRBKifzl3FSXyFmyEpGC2lmxHHAsFljo-UgK7y0zrFp7cm4imaCpR7acQEgg6Z53btAgQQWL9hievRDCQIdozoueY3TdmBvjV5Lr-r_o5KXQC-w',
    carrier_name: 'BlueDart Express',
    tracking_number: 'BD-89210491',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    items: [
      {
        id: 'item-3',
        order_id: 'ord-1002',
        product_id: 'prod-3',
        product_name: 'Artisan Wood Frame (Dark Oak)',
        product_price: 89.00,
        quantity: 14,
        subtotal: 1246.00
      }
    ]
  }
];

let auditLogsCache: AdminAuditLog[] = [
  {
    id: 'log-1',
    admin_name: 'Developer (@kaatya6547)',
    action: 'SYSTEM_INITIALIZATION',
    entity_type: 'SYSTEM',
    details: { message: 'Initialized Quality Glass Emporium schema and seed catalog.' },
    created_at: new Date().toISOString()
  }
];

let websiteContentCache: Record<string, string> = {
  about_us: `Quality Glass Emporium And Photo Framing Center is Raebareli's premier destination for custom picture frames, museum-grade glass, optical acrylic fronts, and artisan woodcraft. Located near Hotel Ganesh in PNT Colony, Raebareli, we specialize in archival framing that protects and enhances your photos, certificates, and fine art prints.`,
  contact_info: `Visit our showroom at Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh. Call or WhatsApp us at +91 94150 65470. Open Monday through Sunday until 9:00 PM.`,
  shipping_policy: `Orders are custom framed and dispatched within 2-4 business days. We offer free standard shipping on orders exceeding ₹2,000. All glass items are securely packaged with protective wooden casing to ensure zero breakage during transit.`,
  privacy_policy: `At Quality Glass Emporium, we prioritize customer privacy. All personal information and payment confirmation receipts uploaded for order verification are stored securely with strict encryption and accessible only by authorized store administrators.`
};

export class StoreService {
  // PRODUCTS
  static async getProducts(params?: { categorySlug?: string; search?: string; sort?: string; featuredOnly?: boolean }) {
    let list = [...productsCache];

    if (params?.categorySlug) {
      const cat = categoriesCache.find(c => c.slug === params.categorySlug);
      if (cat) {
        list = list.filter(p => p.category_id === cat.id);
      }
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }

    if (params?.featuredOnly) {
      list = list.filter(p => p.is_featured);
    }

    if (params?.sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params?.sort === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    const product = productsCache.find(p => p.slug === slug || p.id === slug);
    if (!product) return null;
    const cat = categoriesCache.find(c => c.id === product.category_id);
    return { ...product, category: cat };
  }

  static async saveProduct(productData: Partial<Product>): Promise<Product> {
    if (productData.id && productsCache.some(p => p.id === productData.id)) {
      const index = productsCache.findIndex(p => p.id === productData.id);
      const updated: Product = {
        ...productsCache[index],
        ...productData,
        updated_at: new Date().toISOString()
      } as Product;
      productsCache[index] = updated;
      this.logAudit('EDIT_PRODUCT', 'PRODUCT', updated.id, { name: updated.name, price: updated.price });
      return updated;
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productData.name || 'New Glass Frame',
        slug: productData.slug || `product-${Date.now()}`,
        description: productData.description || '',
        price: Number(productData.price) || 0,
        sale_price: productData.sale_price ? Number(productData.sale_price) : null,
        sku: productData.sku || `SKU-${Date.now()}`,
        stock: Number(productData.stock) || 10,
        status: productData.status || 'published',
        category_id: productData.category_id || categoriesCache[0]?.id,
        images: productData.images?.length ? productData.images : ['https://lh3.googleusercontent.com/aida-public/AB6AXuC0deHpOcBxKeTT0PHLaDpu4X7s3ndCflvOyTl9thmDWWmPLCqGVcg-46405FjhAhHSGiWj5UEXd0SzvmyepNjzs2z9l5uCXLPXBUOO7YHKRZLweWqiLI941pj9K7pXjcHQqELzZQBNSxSKV4mmn6rbiVZ2w4lMTpEyo3cFbtkHJB8SfkUdPXZ8m0SYbv9_YMWQQMvz-zTY0F9RYjaCRa80TKkxd_vngPIZiZjkVXrn6y-QLyOHnG0Qsg'],
        specifications: productData.specifications || { material: 'Glass & Wood' },
        is_featured: Boolean(productData.is_featured),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      productsCache.unshift(newProduct);
      this.logAudit('CREATE_PRODUCT', 'PRODUCT', newProduct.id, { name: newProduct.name });
      return newProduct;
    }
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const p = productsCache.find(x => x.id === id);
    productsCache = productsCache.filter(x => x.id !== id);
    if (p) {
      this.logAudit('DELETE_PRODUCT', 'PRODUCT', id, { name: p.name });
    }
    return true;
  }

  // CATEGORIES
  static async getCategories(): Promise<Category[]> {
    return [...categoriesCache].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  static async saveCategory(catData: Partial<Category>): Promise<Category> {
    if (catData.id && categoriesCache.some(c => c.id === catData.id)) {
      const idx = categoriesCache.findIndex(c => c.id === catData.id);
      categoriesCache[idx] = { ...categoriesCache[idx], ...catData };
      return categoriesCache[idx];
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catData.name || 'New Category',
        slug: catData.slug || `cat-${Date.now()}`,
        description: catData.description || '',
        image_url: catData.image_url || '',
        display_order: categoriesCache.length + 1,
        created_at: new Date().toISOString()
      };
      categoriesCache.push(newCat);
      return newCat;
    }
  }

  static async deleteCategory(id: string): Promise<boolean> {
    categoriesCache = categoriesCache.filter(c => c.id !== id);
    return true;
  }

  // BANNERS
  static async getBanners(): Promise<Banner[]> {
    return [...bannersCache].filter(b => b.is_active).sort((a, b) => a.display_order - b.display_order);
  }

  static async getAllBanners(): Promise<Banner[]> {
    return [...bannersCache].sort((a, b) => a.display_order - b.display_order);
  }

  static async saveBanner(bannerData: Partial<Banner>): Promise<Banner> {
    if (bannerData.id && bannersCache.some(b => b.id === bannerData.id)) {
      const idx = bannersCache.findIndex(b => b.id === bannerData.id);
      bannersCache[idx] = { ...bannersCache[idx], ...bannerData };
      return bannersCache[idx];
    } else {
      const newB: Banner = {
        id: `ban-${Date.now()}`,
        title: bannerData.title || 'New Banner',
        subtitle: bannerData.subtitle || '',
        image_url: bannerData.image_url || 'https://lh3.googleusercontent.com/aida/AP1WRLvs8glZE8N7jK5D808-t789KgAwZl0I210VBmbNiBcM2KkBQO9iZ62hhgIhiWH4m9J2ctimt8Ts3dwNbTCOFWRPEYO3m79DI_O0DBULkzgk6Ci5yiGoM2SSZI3kBPgrGcXiuVyZhdYTC_ZN_YcNIl89i_ZsQQDBcvhLKYr57roQbstG8fojV7GLmuLhrnEovfFBcDdIOS-HP48DLpdJvXyKmrbdhMGSTNNyy8d1fQOmti14Zje1HgUGDXNs',
        link_url: bannerData.link_url || '/products',
        button_text: bannerData.button_text || 'Shop Now',
        display_order: bannersCache.length + 1,
        is_active: bannerData.is_active ?? true
      };
      bannersCache.push(newB);
      return newB;
    }
  }

  // ORDERS & LOGISTICS
  static async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return ordersCache.filter(o => o.user_id === userId);
    }
    return [...ordersCache].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getOrderById(id: string): Promise<Order | null> {
    return ordersCache.find(o => o.id === id || o.order_number === id) || null;
  }

  static async createOrder(orderPayload: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Promise<Order> {
    const orderNum = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      order_number: orderNum,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    ordersCache.unshift(newOrder);
    this.logAudit('CREATE_ORDER', 'ORDER', newOrder.id, { order_number: orderNum, total: newOrder.total_amount });
    return newOrder;
  }

  static async updateOrderStatus(
    orderId: string, 
    status: Order['status'], 
    payload?: { payment_notes?: string; carrier_name?: string; tracking_number?: string }
  ): Promise<Order | null> {
    const order = ordersCache.find(o => o.id === orderId || o.order_number === orderId);
    if (!order) return null;

    order.status = status;
    order.updated_at = new Date().toISOString();

    if (payload?.payment_notes !== undefined) order.payment_notes = payload.payment_notes;
    if (payload?.carrier_name !== undefined) order.carrier_name = payload.carrier_name;
    if (payload?.tracking_number !== undefined) order.tracking_number = payload.tracking_number;

    this.logAudit('UPDATE_ORDER_STATUS', 'ORDER', order.id, { status, notes: payload?.payment_notes });
    return order;
  }

  // SITE SETTINGS
  static async getSiteSettings(): Promise<SiteSettings> {
    return { ...siteSettingsCache };
  }

  static async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    siteSettingsCache = { ...siteSettingsCache, ...settings };
    this.logAudit('UPDATE_SITE_SETTINGS', 'SETTINGS', 'global', settings);
    return { ...siteSettingsCache };
  }

  // CMS WEBSITE CONTENT
  static async getWebsiteContent(key?: string): Promise<Record<string, string>> {
    if (key) return { [key]: websiteContentCache[key] || '' };
    return { ...websiteContentCache };
  }

  static async updateWebsiteContent(key: string, content: string): Promise<void> {
    websiteContentCache[key] = content;
    this.logAudit('UPDATE_CMS_CONTENT', 'CMS', key, { length: content.length });
  }

  // COUPONS
  static async getCoupons(): Promise<Coupon[]> {
    return [...couponsCache];
  }

  static async saveCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
    if (couponData.id && couponsCache.some(c => c.id === couponData.id)) {
      const idx = couponsCache.findIndex(c => c.id === couponData.id);
      couponsCache[idx] = { ...couponsCache[idx], ...couponData };
      return couponsCache[idx];
    } else {
      const newC: Coupon = {
        id: `coup-${Date.now()}`,
        code: (couponData.code || 'DISCOUNT10').toUpperCase(),
        discount_type: couponData.discount_type || 'percent',
        discount_value: Number(couponData.discount_value) || 10,
        min_order_amount: Number(couponData.min_order_amount) || 0,
        is_active: couponData.is_active ?? true
      };
      couponsCache.push(newC);
      return newC;
    }
  }

  static async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discountAmount: number; message?: string }> {
    const coupon = couponsCache.find(c => c.code.toUpperCase() === code.toUpperCase() && c.is_active);
    if (!coupon) {
      return { valid: false, discountAmount: 0, message: 'Invalid or expired coupon code.' };
    }

    if (subtotal < coupon.min_order_amount) {
      return { valid: false, discountAmount: 0, message: `Coupon requires minimum order of ₹${coupon.min_order_amount}` };
    }

    let discount = 0;
    if (coupon.discount_type === 'percent') {
      discount = (subtotal * coupon.discount_value) / 100;
    } else {
      discount = coupon.discount_value;
    }

    return { valid: true, discountAmount: Math.min(discount, subtotal) };
  }

  // REVIEWS
  static async getReviews(productId?: string): Promise<Review[]> {
    if (productId) {
      return reviewsCache.filter(r => r.product_id === productId && r.is_approved);
    }
    return [...reviewsCache];
  }

  static async addReview(review: Omit<Review, 'id' | 'created_at' | 'is_approved'>): Promise<Review> {
    const newR: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      is_approved: false, // Requires admin approval
      created_at: new Date().toISOString()
    };
    reviewsCache.unshift(newR);
    return newR;
  }

  static async moderateReview(reviewId: string, approve: boolean): Promise<void> {
    const rev = reviewsCache.find(r => r.id === reviewId);
    if (rev) {
      rev.is_approved = approve;
      this.logAudit('MODERATE_REVIEW', 'REVIEW', reviewId, { approved: approve });
    }
  }

  // ADMIN AUDIT LOGS
  static async getAuditLogs(): Promise<AdminAuditLog[]> {
    return [...auditLogsCache].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  private static logAudit(action: string, entity_type: string, entity_id?: string, details?: any) {
    auditLogsCache.unshift({
      id: `log-${Date.now()}`,
      admin_name: 'Store Admin',
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString()
    });
  }

  // DASHBOARD METRICS
  static async getDashboardMetrics() {
    const totalOrders = ordersCache.length;
    const totalRevenue = ordersCache
      .filter(o => o.status !== 'cancelled' && o.status !== 'payment_rejected')
      .reduce((acc, o) => acc + o.total_amount, 0);

    const pendingApprovals = ordersCache.filter(o => o.status === 'pending_payment').length;
    const lowStockProducts = productsCache.filter(p => p.stock <= 5);
    const totalCustomers = new Set(ordersCache.map(o => o.customer_email)).size + 2;

    return {
      totalRevenue,
      grossSales: totalOrders,
      activeSessions: 1204,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      pendingApprovals,
      totalCustomers,
      totalProducts: productsCache.length,
      lowStockProducts,
      recentOrders: ordersCache.slice(0, 5)
    };
  }
}

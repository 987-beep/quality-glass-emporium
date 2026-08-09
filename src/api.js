// Central API configuration and helper module
const RAW_API_BASE = import.meta.env.VITE_API_URL || '';
export const API_BASE = RAW_API_BASE.replace(/\/$/, '');

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';

/**
 * Universal wrapper around fetch for all backend API calls.
 */
export function apiFetch(endpoint, options = {}) {
  const targetUrl = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
  return fetch(targetUrl, options);
}

/**
 * Helper to construct full URL for static assets like uploads & Cloudinary images.
 */
export function getAssetUrl(relativePath) {
  if (!relativePath || relativePath.trim() === '') {
    return DEFAULT_FALLBACK_IMAGE;
  }
  if (relativePath.startsWith('http') || relativePath.startsWith('data:')) {
    return relativePath;
  }
  return `${API_BASE}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
}

// Helper for LocalStorage JSON
function getStorageJSON(key, fallback = null) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageJSON(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// 1. PRODUCTS PERSISTENCE
export function getLocalProducts() {
  return getStorageJSON('qge_custom_products', []);
}

export function saveLocalProduct(product) {
  if (!product || !product.id) return;
  const list = getLocalProducts();
  const index = list.findIndex(p => p.id === product.id);
  if (index > -1) {
    list[index] = { ...list[index], ...product };
  } else {
    list.unshift(product);
  }
  setStorageJSON('qge_custom_products', list);
}

export function removeLocalProduct(productId) {
  if (!productId) return;
  const list = getLocalProducts().filter(p => p.id !== productId);
  setStorageJSON('qge_custom_products', list);
}

export function syncProductsWithLocal(serverProducts) {
  const serverList = Array.isArray(serverProducts) ? serverProducts : [];
  const localList = getLocalProducts();

  const map = new Map();
  localList.forEach(p => { if (p && p.id) map.set(p.id, p); });
  serverList.forEach(p => { if (p && p.id) map.set(p.id, { ...(map.get(p.id) || {}), ...p }); });

  return Array.from(map.values());
}

// 2. CATEGORIES PERSISTENCE
export function getLocalCategories() {
  return getStorageJSON('qge_custom_categories', []);
}

export function saveLocalCategory(category) {
  if (!category || !category.id) return;
  const list = getLocalCategories();
  const index = list.findIndex(c => c.id === category.id);
  if (index > -1) {
    list[index] = { ...list[index], ...category };
  } else {
    list.push(category);
  }
  setStorageJSON('qge_custom_categories', list);
}

export function removeLocalCategory(catId) {
  if (!catId) return;
  const list = getLocalCategories().filter(c => c.id !== catId);
  setStorageJSON('qge_custom_categories', list);
}

export function syncCategoriesWithLocal(serverCategories) {
  const serverList = Array.isArray(serverCategories) ? serverCategories : [];
  const localList = getLocalCategories();

  const map = new Map();
  localList.forEach(c => { if (c && c.id) map.set(c.id, c); });
  serverList.forEach(c => { if (c && c.id) map.set(c.id, { ...(map.get(c.id) || {}), ...c }); });

  return Array.from(map.values());
}

// 3. MAIN PAGE PERSISTENCE
export function getLocalMainPage() {
  return getStorageJSON('qge_main_page', null);
}

export function saveLocalMainPage(mainPageData) {
  setStorageJSON('qge_main_page', mainPageData);
}

// 4. BANNERS PERSISTENCE
export function getLocalBanners() {
  return getStorageJSON('qge_custom_banners', []);
}

export function saveLocalBanner(banner) {
  if (!banner || !banner.id) return;
  const list = getLocalBanners();
  const index = list.findIndex(b => b.id === banner.id);
  if (index > -1) {
    list[index] = { ...list[index], ...banner };
  } else {
    list.push(banner);
  }
  setStorageJSON('qge_custom_banners', list);
}

export function removeLocalBanner(bannerId) {
  if (!bannerId) return;
  const list = getLocalBanners().filter(b => b.id !== bannerId);
  setStorageJSON('qge_custom_banners', list);
}

export function syncBannersWithLocal(serverBanners) {
  const serverList = Array.isArray(serverBanners) ? serverBanners : [];
  const localList = getLocalBanners();

  const map = new Map();
  localList.forEach(b => { if (b && b.id) map.set(b.id, b); });
  serverList.forEach(b => { if (b && b.id) map.set(b.id, { ...(map.get(b.id) || {}), ...b }); });

  return Array.from(map.values());
}

// 5. PAYMENT CONFIG PERSISTENCE
export function getLocalPaymentConfig() {
  return getStorageJSON('qge_payment_config', null);
}

export function saveLocalPaymentConfig(config) {
  setStorageJSON('qge_payment_config', config);
}

// 6. STORE & SEO SETTINGS PERSISTENCE
export function getLocalSettings() {
  return getStorageJSON('qge_store_settings', null);
}

export function saveLocalSettings(settings) {
  const existing = getLocalSettings() || {};
  setStorageJSON('qge_store_settings', { ...existing, ...settings });
}

// 7. COUPONS PERSISTENCE
export function getLocalCoupons() {
  return getStorageJSON('qge_custom_coupons', []);
}

export function saveLocalCoupon(coupon) {
  if (!coupon || !coupon.id) return;
  const list = getLocalCoupons();
  const index = list.findIndex(c => c.id === coupon.id || c.code === coupon.code);
  if (index > -1) {
    list[index] = { ...list[index], ...coupon };
  } else {
    list.unshift(coupon);
  }
  setStorageJSON('qge_custom_coupons', list);
}

export function removeLocalCoupon(couponId) {
  if (!couponId) return;
  const list = getLocalCoupons().filter(c => c.id !== couponId && c.code !== couponId);
  setStorageJSON('qge_custom_coupons', list);
}

export function syncCouponsWithLocal(serverCoupons) {
  const serverList = Array.isArray(serverCoupons) ? serverCoupons : [];
  const localList = getLocalCoupons();

  const map = new Map();
  localList.forEach(c => { if (c && c.id) map.set(c.id, c); });
  serverList.forEach(c => { if (c && c.id) map.set(c.id, { ...(map.get(c.id) || {}), ...c }); });

  return Array.from(map.values());
}

// 8. ORDERS PERSISTENCE
export function getLocalOrders() {
  return getStorageJSON('qge_custom_orders', []);
}

export function saveLocalOrder(order) {
  if (!order || !order.id) return;
  const list = getLocalOrders();
  const index = list.findIndex(o => o.id === order.id);
  if (index > -1) {
    list[index] = { ...list[index], ...order };
  } else {
    list.unshift(order);
  }
  setStorageJSON('qge_custom_orders', list);
}

export function syncOrdersWithLocal(serverOrders) {
  const serverList = Array.isArray(serverOrders) ? serverOrders : [];
  const localList = getLocalOrders();

  const map = new Map();
  localList.forEach(o => { if (o && o.id) map.set(o.id, o); });
  serverList.forEach(o => { if (o && o.id) map.set(o.id, { ...(map.get(o.id) || {}), ...o }); });

  return Array.from(map.values());
}

// 9. REVIEWS PERSISTENCE
export function getLocalReviews() {
  return getStorageJSON('qge_custom_reviews', []);
}

export function saveLocalReview(review) {
  if (!review || !review.id) return;
  const list = getLocalReviews();
  const index = list.findIndex(r => r.id === review.id);
  if (index > -1) {
    list[index] = { ...list[index], ...review };
  } else {
    list.unshift(review);
  }
  setStorageJSON('qge_custom_reviews', list);
}

export function syncReviewsWithLocal(serverReviews) {
  const serverList = Array.isArray(serverReviews) ? serverReviews : [];
  const localList = getLocalReviews();

  const map = new Map();
  localList.forEach(r => { if (r && r.id) map.set(r.id, r); });
  serverList.forEach(r => { if (r && r.id) map.set(r.id, { ...(map.get(r.id) || {}), ...r }); });

  return Array.from(map.values());
}

export const setLocalOrders = saveLocalOrder;
export const setLocalCategories = saveLocalCategory;

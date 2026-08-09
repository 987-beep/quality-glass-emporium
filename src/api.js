// Central API configuration and helper module
const RAW_API_BASE = import.meta.env.VITE_API_URL || '';
export const API_BASE = RAW_API_BASE.replace(/\/$/, '');

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';

/**
 * Universal wrapper around fetch for all backend API calls.
 * Prepends VITE_API_URL if configured, otherwise uses relative paths.
 * 
 * @param {string} endpoint - API path e.g. '/api/auth/login'
 * @param {RequestInit} [options] - Standard fetch options
 * @returns {Promise<Response>}
 */
export function apiFetch(endpoint, options = {}) {
  const targetUrl = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
  return fetch(targetUrl, options);
}

/**
 * Helper to construct full URL for static assets like uploads & Cloudinary images.
 * 
 * @param {string} relativePath - e.g. '/uploads/image.jpg' or Cloudinary URL
 * @returns {string}
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

// Client-side LocalStorage Persistence for Dynamic Admin Additions
export function getLocalProducts() {
  try {
    const saved = localStorage.getItem('qge_custom_products');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveLocalProduct(newOrUpdatedProduct) {
  if (!newOrUpdatedProduct || !newOrUpdatedProduct.id) return;
  try {
    const existing = getLocalProducts();
    const index = existing.findIndex(p => p.id === newOrUpdatedProduct.id);
    if (index > -1) {
      existing[index] = newOrUpdatedProduct;
    } else {
      existing.unshift(newOrUpdatedProduct);
    }
    localStorage.setItem('qge_custom_products', JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving local product:', e);
  }
}

export function removeLocalProduct(productId) {
  if (!productId) return;
  try {
    const existing = getLocalProducts().filter(p => p.id !== productId);
    localStorage.setItem('qge_custom_products', JSON.stringify(existing));
  } catch (e) {
    console.error('Error deleting local product:', e);
  }
}

export function syncProductsWithLocal(serverProducts) {
  const serverList = Array.isArray(serverProducts) ? serverProducts : [];
  const localList = getLocalProducts();

  const map = new Map();
  serverList.forEach(p => {
    if (p && p.id) map.set(p.id, p);
  });
  localList.forEach(p => {
    if (p && p.id) map.set(p.id, p);
  });

  return Array.from(map.values());
}

export function getLocalCategories() {
  return null;
}

export function setLocalCategories() {
  // No-op
}

export function syncCategoriesWithLocal(serverCategories) {
  return Array.isArray(serverCategories) ? serverCategories : [];
}

export function getLocalOrders() {
  return [];
}

export function setLocalOrders() {
  // No-op
}

export function syncOrdersWithLocal(serverOrders) {
  return Array.isArray(serverOrders) ? serverOrders : [];
}

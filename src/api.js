// Central API configuration and helper module
const RAW_API_BASE = import.meta.env.VITE_API_URL || '';
export const API_BASE = RAW_API_BASE.replace(/\/$/, '');

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
 * Helper to construct full URL for static assets like uploads.
 * 
 * @param {string} relativePath - e.g. '/uploads/image.jpg'
 * @returns {string}
 */
export function getAssetUrl(relativePath) {
  if (!relativePath) return '';
  if (relativePath.startsWith('http') || relativePath.startsWith('data:')) {
    return relativePath;
  }
  return `${API_BASE}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
}

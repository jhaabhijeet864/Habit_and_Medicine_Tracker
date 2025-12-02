// Enhanced API client with JWT authentication
import { getApiUrl } from '../config/config.js';
import { STORAGE_KEYS } from '../config/constants.js';

/**
 * Get auth token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
}

/**
 * Remove auth token (logout)
 */
export function clearAuthToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Main API request function with JWT authentication
 */
export async function apiRequest(path, { method = 'GET', data, headers = {} } = {}) {
  const token = getAuthToken();
  
  // Build headers with authentication
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };
  
  // Add JWT token if available
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  // Build request options
  const opts = {
    method,
    headers: requestHeaders
  };
  
  // Add body for POST/PUT/PATCH requests
  if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    opts.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(getApiUrl(path), opts);
    const contentType = res.headers.get('content-type') || '';
    
    // Parse response
    let payload;
    if (contentType.includes('application/json')) {
      payload = await res.json();
    } else {
      payload = await res.text();
    }
    
    // Handle errors
    if (!res.ok) {
      // Handle 401 Unauthorized - clear token and redirect to login
      if (res.status === 401) {
        clearAuthToken();
        // Optionally redirect to login
        if (window.location.pathname !== '/' && window.location.pathname !== '/pages/auth/login.html') {
          window.location.href = '/pages/auth/login.html';
        }
      }
      
      const errorMessage = typeof payload === 'string' 
        ? payload 
        : (payload.message || payload.error || 'Request failed');
      
      throw new Error(errorMessage);
    }
    
    return payload;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: (path, options = {}) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, data, options = {}) => apiRequest(path, { ...options, method: 'POST', data }),
  put: (path, data, options = {}) => apiRequest(path, { ...options, method: 'PUT', data }),
  patch: (path, data, options = {}) => apiRequest(path, { ...options, method: 'PATCH', data }),
  delete: (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' })
};
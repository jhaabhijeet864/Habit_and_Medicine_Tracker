// Auth helper functions
import { storage } from './storage.js';
import { ENDPOINTS } from '../config/constants.js';
import { apiRequest } from './api.js';

const TOKEN_KEY = 'hs_token';

export const auth = {
  getToken: () => storage.get(TOKEN_KEY),
  setToken: (token) => storage.set(TOKEN_KEY, token),
  clearToken: () => storage.remove(TOKEN_KEY),
  isAuthenticated: () => Boolean(storage.get(TOKEN_KEY)),
  async login(credentials) {
    const data = await apiRequest(ENDPOINTS.auth.login, { method: 'POST', data: credentials });
    if (data && data.token) auth.setToken(data.token);
    return data;
  },
  async signup(payload) {
    return apiRequest(ENDPOINTS.auth.signup, { method: 'POST', data: payload });
  },
  async me() {
    return apiRequest(ENDPOINTS.auth.me, { headers: { Authorization: `Bearer ${auth.getToken() || ''}` } });
  },
  logout() { auth.clearToken(); },
};
// Authentication service with token management
import { ENDPOINTS, STORAGE_KEYS } from '../config/constants.js';
import { apiRequest, setAuthToken, clearAuthToken } from '../utils/api.js';

export const AuthService = {
  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await apiRequest(ENDPOINTS.auth.login, { 
        method: 'POST', 
        data: credentials 
      });
      
      // Store token and user data
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user
   */
  async signup(userData) {
    try {
      const response = await apiRequest(ENDPOINTS.auth.signup, { 
        method: 'POST', 
        data: userData 
      });
      
      // Store token and user data
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
      }
      
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  async me() {
    try {
      const response = await apiRequest(ENDPOINTS.auth.me);
      
      // Update stored user data
      if (response.success && response.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
      }
      
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    clearAuthToken();
    window.location.href = '/pages/auth/login.html';
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Get stored user data
   */
  getCurrentUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }
};
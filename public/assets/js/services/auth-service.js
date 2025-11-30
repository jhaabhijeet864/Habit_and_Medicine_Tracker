// Authentication service wrapper
import { ENDPOINTS } from '../config/constants.js';
import { apiRequest } from '../utils/api.js';

export const AuthService = {
  login(payload) { return apiRequest(ENDPOINTS.auth.login, { method: 'POST', data: payload }); },
  signup(payload) { return apiRequest(ENDPOINTS.auth.signup, { method: 'POST', data: payload }); },
  me() { return apiRequest(ENDPOINTS.auth.me); },
};
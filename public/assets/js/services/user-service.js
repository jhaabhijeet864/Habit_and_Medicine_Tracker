// User profile operations (stubbed)
import { ENDPOINTS } from '../config/constants.js';
import { apiRequest } from '../utils/api.js';

export const UserService = {
  getProfile(id) { return apiRequest(`${ENDPOINTS.users}/${id}`); },
  updateProfile(id, data) { return apiRequest(`${ENDPOINTS.users}/${id}`, { method: 'PUT', data }); },
};
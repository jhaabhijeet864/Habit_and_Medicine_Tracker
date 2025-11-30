// Medicine CRUD operations (stubbed)
import { ENDPOINTS } from '../config/constants.js';
import { apiRequest } from '../utils/api.js';

export const MedicineService = {
  list() { return apiRequest(ENDPOINTS.medicines); },
  get(id) { return apiRequest(`${ENDPOINTS.medicines}/${id}`); },
  create(data) { return apiRequest(ENDPOINTS.medicines, { method: 'POST', data }); },
  update(id, data) { return apiRequest(`${ENDPOINTS.medicines}/${id}`, { method: 'PUT', data }); },
  remove(id) { return apiRequest(`${ENDPOINTS.medicines}/${id}`, { method: 'DELETE' }); },
};
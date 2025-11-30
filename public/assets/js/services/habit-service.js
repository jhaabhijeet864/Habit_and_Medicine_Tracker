// Habit CRUD operations (stubbed)
import { ENDPOINTS } from '../config/constants.js';
import { apiRequest } from '../utils/api.js';

export const HabitService = {
  list() { return apiRequest(ENDPOINTS.habits); },
  get(id) { return apiRequest(`${ENDPOINTS.habits}/${id}`); },
  create(data) { return apiRequest(ENDPOINTS.habits, { method: 'POST', data }); },
  update(id, data) { return apiRequest(`${ENDPOINTS.habits}/${id}`, { method: 'PUT', data }); },
  remove(id) { return apiRequest(`${ENDPOINTS.habits}/${id}`, { method: 'DELETE' }); },
};
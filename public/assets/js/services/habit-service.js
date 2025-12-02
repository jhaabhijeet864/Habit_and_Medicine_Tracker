// Habit CRUD operations with full API integration
import { ENDPOINTS } from '../config/constants.js';
import { apiRequest } from '../utils/api.js';

export const HabitService = {
  /**
   * Get all habits
   */
  async list(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const path = query ? `${ENDPOINTS.habits}?${query}` : ENDPOINTS.habits;
      return await apiRequest(path);
    } catch (error) {
      console.error('Get habits error:', error);
      throw error;
    }
  },

  /**
   * Get single habit by ID
   */
  async get(id) {
    try {
      return await apiRequest(`${ENDPOINTS.habits}/${id}`);
    } catch (error) {
      console.error('Get habit error:', error);
      throw error;
    }
  },

  /**
   * Create new habit
   */
  async create(data) {
    try {
      return await apiRequest(ENDPOINTS.habits, { 
        method: 'POST', 
        data 
      });
    } catch (error) {
      console.error('Create habit error:', error);
      throw error;
    }
  },

  /**
   * Update habit
   */
  async update(id, data) {
    try {
      return await apiRequest(`${ENDPOINTS.habits}/${id}`, { 
        method: 'PUT', 
        data 
      });
    } catch (error) {
      console.error('Update habit error:', error);
      throw error;
    }
  },

  /**
   * Delete habit
   */
  async remove(id) {
    try {
      return await apiRequest(`${ENDPOINTS.habits}/${id}`, { 
        method: 'DELETE' 
      });
    } catch (error) {
      console.error('Delete habit error:', error);
      throw error;
    }
  },

  /**
   * Log habit completion
   */
  async logCompletion(id, logData) {
    try {
      return await apiRequest(`${ENDPOINTS.habits}/${id}/log`, { 
        method: 'POST', 
        data: logData 
      });
    } catch (error) {
      console.error('Log habit error:', error);
      throw error;
    }
  },

  /**
   * Get habit statistics
   */
  async getStats(id) {
    try {
      return await apiRequest(`${ENDPOINTS.habits}/${id}/stats`);
    } catch (error) {
      console.error('Get habit stats error:', error);
      throw error;
    }
  }
};
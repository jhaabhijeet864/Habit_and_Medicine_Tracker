// Medicine CRUD operations with full API integration
import { ENDPOINTS } from '../config/constants.js';
import { apiRequest } from '../utils/api.js';

export const MedicineService = {
  /**
   * Get all medicines
   */
  async list(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const path = query ? `${ENDPOINTS.medicines}?${query}` : ENDPOINTS.medicines;
      return await apiRequest(path);
    } catch (error) {
      console.error('Get medicines error:', error);
      throw error;
    }
  },

  /**
   * Get single medicine by ID
   */
  async get(id) {
    try {
      return await apiRequest(`${ENDPOINTS.medicines}/${id}`);
    } catch (error) {
      console.error('Get medicine error:', error);
      throw error;
    }
  },

  /**
   * Create new medicine
   */
  async create(data) {
    try {
      return await apiRequest(ENDPOINTS.medicines, { 
        method: 'POST', 
        data 
      });
    } catch (error) {
      console.error('Create medicine error:', error);
      throw error;
    }
  },

  /**
   * Update medicine
   */
  async update(id, data) {
    try {
      return await apiRequest(`${ENDPOINTS.medicines}/${id}`, { 
        method: 'PUT', 
        data 
      });
    } catch (error) {
      console.error('Update medicine error:', error);
      throw error;
    }
  },

  /**
   * Delete medicine
   */
  async remove(id) {
    try {
      return await apiRequest(`${ENDPOINTS.medicines}/${id}`, { 
        method: 'DELETE' 
      });
    } catch (error) {
      console.error('Delete medicine error:', error);
      throw error;
    }
  },

  /**
   * Log medicine intake
   */
  async logIntake(id, logData) {
    try {
      return await apiRequest(`${ENDPOINTS.medicines}/${id}/log`, { 
        method: 'POST', 
        data: logData 
      });
    } catch (error) {
      console.error('Log medicine error:', error);
      throw error;
    }
  },

  /**
   * Update medicine inventory
   */
  async updateInventory(id, inventoryData) {
    try {
      return await apiRequest(`${ENDPOINTS.medicines}/${id}/inventory`, { 
        method: 'PUT', 
        data: inventoryData 
      });
    } catch (error) {
      console.error('Update inventory error:', error);
      throw error;
    }
  },

  /**
   * Get medicine statistics
   */
  async getStats(id) {
    try {
      return await apiRequest(`${ENDPOINTS.medicines}/${id}/stats`);
    } catch (error) {
      console.error('Get medicine stats error:', error);
      throw error;
    }
  }
};
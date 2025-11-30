// App constants and API endpoints
export const APP_NAME = 'Habit Sync';
export const API_BASE = '/api';

export const ENDPOINTS = {
  auth: {
    login: `${API_BASE}/auth/login`,
    signup: `${API_BASE}/auth/signup`,
    me: `${API_BASE}/auth/me`,
  },
  habits: `${API_BASE}/habits`,
  medicines: `${API_BASE}/medicines`,
  users: `${API_BASE}/users`,
};
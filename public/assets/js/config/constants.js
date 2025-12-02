// API Endpoints
export const ENDPOINTS = {
  // Authentication
  auth: {
    login: '/users/login',
    signup: '/users/register',
    me: '/users/profile'
  },
  
  // Habits
  habits: '/habits',
  
  // Medicines
  medicines: '/medicines',
  
  // Reminders
  reminders: '/reminders',
  
  // User
  user: {
    profile: '/users/profile',
    update: '/users/profile',
    delete: '/users/profile'
  }
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'theme_preference'
};

// App constants
export const APP_NAME = 'Habit & Medicine Tracker';
export const TOKEN_EXPIRY_DAYS = 30;
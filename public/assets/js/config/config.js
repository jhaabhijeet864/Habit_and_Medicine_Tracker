// API Configuration
export const isDev = () => location.hostname === 'localhost' || location.hostname === '127.0.0.1';

// Base API URL - change this when deploying to production
export const API_BASE_URL = isDev() 
  ? 'http://localhost:5000/api'  // Development
  : 'https://your-production-api.com/api'; // Production

export const getApiUrl = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
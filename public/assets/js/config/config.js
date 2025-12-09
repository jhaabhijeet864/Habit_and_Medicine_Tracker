// Simple runtime configuration helper
export const isDev = () => location.hostname === 'localhost' || location.hostname === '127.0.0.1';

export const getApiUrl = (path) => {
  // API served from same origin under /api
  const base = '/api';
  return `${base}${path}`;
};
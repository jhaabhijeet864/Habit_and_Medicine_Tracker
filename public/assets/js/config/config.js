// Simple runtime configuration helper
export const isDev = () => location.hostname === 'localhost' || location.hostname === '127.0.0.1';

export const getApiUrl = (path) => {
  // If you deploy API separately, change this to full origin.
  const base = isDev() ? '' : '';
  return `${base}${path}`;
};
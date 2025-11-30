// Dashboard logic
import { showToast } from '../components/toast.js';

(() => {
  // Example greeting when dashboard loads
  showToast('Dashboard ready', { type: 'info', duration: 1200 });
})();
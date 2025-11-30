// Landing page logic
import { showToast } from '../components/toast.js';

(() => {
  // Example: announce JS loaded on landing page for debugging
  const banner = document.querySelector('[data-landing-banner]');
  if (banner) {
    banner.addEventListener('click', () => showToast('Welcome to Habit Sync!', { type: 'success' }));
  }
})();
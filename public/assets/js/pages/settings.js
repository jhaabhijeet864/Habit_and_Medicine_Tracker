// Settings page logic
import { showToast } from '../components/toast.js';

(() => {
  const btn = document.querySelector('[data-save-settings]');
  if (!btn) return;
  btn.addEventListener('click', () => showToast('Settings saved', { type: 'success' }));
})();
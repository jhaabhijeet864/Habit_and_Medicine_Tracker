import { showToast } from '../components/toast.js';
import { api } from '../utils/api.js';
import { storage } from '../utils/storage.js';

const TOKEN_KEY = 'hs_token';

function initApiToken() {
  const stored = storage.get(TOKEN_KEY);
  if (stored?.value) api.setToken(stored.value);
}

async function snoozeReminder(reminderId, minutes = 10) {
  await api.put(`/reminders/${reminderId}/snooze`, { minutes });
  showToast(`Snoozed for ${minutes} min`, { type: 'info' });
}

async function deleteReminder(reminderId) {
  await api.del(`/reminders/${reminderId}`);
  showToast('Reminder deleted', { type: 'success' });
}

function bindReminderActions() {
  document.body.addEventListener('click', async (e) => {
    const snoozeBtn = e.target.closest('[data-reminder-snooze]');
    const deleteBtn = e.target.closest('[data-reminder-delete]');
    try {
      if (snoozeBtn) {
        const id = snoozeBtn.dataset.reminderSnooze;
        const minutes = Number(snoozeBtn.dataset.minutes || 10);
        await snoozeReminder(id, minutes);
      }
      if (deleteBtn) {
        const id = deleteBtn.dataset.reminderDelete;
        await deleteReminder(id);
      }
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Action failed', { type: 'error' });
    }
  });
}

(() => {
  initApiToken();
  bindReminderActions();
  showToast('Dashboard ready', { type: 'info', duration: 1200 });
})();
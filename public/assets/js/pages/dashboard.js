import { showToast } from '../components/toast.js';
import { api } from '../utils/api.js';
import { storage } from '../utils/storage.js';

const TOKEN_KEY = 'hs_token';
const listEl = document.getElementById('remindersList');
const emptyEl = document.getElementById('remindersEmpty');

function initApiToken() {
  const stored = storage.get(TOKEN_KEY);
  if (stored?.value) api.setToken(stored.value);
}

function renderReminders(reminders = []) {
  if (!listEl) return;
  listEl.innerHTML = '';
  if (!reminders.length) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');

  reminders.forEach(reminder => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm';
    item.innerHTML = `
      <div>
        <p class="text-sm text-gray-500">${reminder.time} • ${reminder.days?.join(', ') || 'Every day'}</p>
        <p class="text-base font-semibold text-gray-900">${reminder.title}</p>
        <p class="text-sm text-gray-600">${reminder.notes || ''}</p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" data-reminder-snooze="${reminder._id}" data-minutes="10">Snooze 10m</button>
        <button class="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600" data-reminder-delete="${reminder._id}">Delete</button>
      </div>
    `;
    listEl.appendChild(item);
  });
}

async function loadReminders() {
  try {
    const res = await api.get('/reminders');
    const reminders = res?.data || [];
    renderReminders(reminders);
  } catch (err) {
    showToast(err?.response?.data?.message || err.message || 'Failed to load reminders', { type: 'error' });
  }
}

async function snoozeReminder(reminderId, minutes = 10) {
  await api.put(`/reminders/${reminderId}/snooze`, { minutes });
  showToast(`Snoozed for ${minutes} min`, { type: 'info' });
  await loadReminders();
}

async function deleteReminder(reminderId) {
  await api.del(`/reminders/${reminderId}`);
  showToast('Reminder deleted', { type: 'success' });
  await loadReminders();
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
  loadReminders();
  showToast('Dashboard ready', { type: 'info', duration: 1200 });
})();
// Habit management (client-side)
import { storage } from '../utils/storage.js';
import { showToast } from '../components/toast.js';

const KEY = 'hs_habits';
const el = {
  list: document.getElementById('habitsList'),
  empty: document.getElementById('emptyState'),
  addBtn: document.getElementById('addHabitBtn'),
  modal: document.getElementById('habitModal'),
  closeModal: document.getElementById('closeModalBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  form: document.getElementById('habitForm'),
  name: document.getElementById('habitName'),
  freq: document.getElementById('habitFrequency'),
  customDays: document.getElementById('customDaysSection'),
};

function openModal() { el.modal.classList.remove('hidden'); }
function closeModal() { el.modal.classList.add('hidden'); el.form.reset(); el.customDays.classList.add('hidden'); }

function daysSelected() {
  return Array.from(document.querySelectorAll('#customDaysSection .day-btn.active')).map((b) => b.dataset.day);
}

function load() { return storage.get(KEY, []); }
function save(items) { storage.set(KEY, items); }

function render() {
  const items = load();
  el.list.innerHTML = '';
  if (!items.length) {
    el.empty.classList.remove('hidden');
    return;
  }
  el.empty.classList.add('hidden');

  items.forEach((h) => {
    const row = document.createElement('div');
    row.className = 'bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100';
    row.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 flex-1">
          <label class="relative flex items-center cursor-pointer">
            <input type="checkbox" class="peer w-6 h-6 text-green-600 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 checked:bg-green-600 checked:border-green-600" data-action="toggle" data-id="${h.id}" ${h.completed ? 'checked' : ''}>
          </label>
          <div class="flex-1">
            <h3 class="text-lg font-semibold ${h.completed ? 'text-gray-500 line-through' : 'text-gray-900'}">${h.name}</h3>
            <p class="text-sm text-gray-500 mt-0.5">${h.frequency}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" data-action="edit" data-id="${h.id}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" data-action="delete" data-id="${h.id}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>`;
    el.list.appendChild(row);
  });
}

function upsertHabit(habit) {
  const items = load();
  const idx = items.findIndex((x) => x.id === habit.id);
  if (idx >= 0) items[idx] = habit; else items.push(habit);
  save(items);
  render();
}

function removeHabit(id) {
  save(load().filter((x) => x.id !== id));
  render();
}

// Events
el.addBtn?.addEventListener('click', openModal);
el.closeModal?.addEventListener('click', closeModal);
el.cancelBtn?.addEventListener('click', closeModal);

el.freq?.addEventListener('change', () => {
  if (el.freq.value === 'custom') el.customDays.classList.remove('hidden');
  else el.customDays.classList.add('hidden');
});

document.querySelectorAll('#customDaysSection .day-btn').forEach((btn) => {
  btn.addEventListener('click', () => btn.classList.toggle('active'));
});

el.form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = el.name.value.trim();
  const frequency = el.freq.value;
  if (!name) return showToast('Please enter a habit name', { type: 'warning' });
  const habit = {
    id: crypto.randomUUID(),
    name,
    frequency,
    days: frequency === 'custom' ? daysSelected() : [],
    completed: false,
    createdAt: Date.now(),
  };
  upsertHabit(habit);
  closeModal();
  showToast('Habit added', { type: 'success' });
});

// Delegated actions
el.list?.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const id = target.getAttribute('data-id');
  const items = load();
  const current = items.find((x) => x.id === id);
  if (!current) return;
  const action = target.getAttribute('data-action');
  if (action === 'toggle') {
    current.completed = !current.completed;
    upsertHabit(current);
  } else if (action === 'delete') {
    removeHabit(id);
    showToast('Habit removed', { type: 'success' });
  } else if (action === 'edit') {
    openModal();
    el.name.value = current.name;
    el.freq.value = current.frequency;
    if (current.frequency === 'custom') {
      el.customDays.classList.remove('hidden');
      document.querySelectorAll('#customDaysSection .day-btn').forEach((btn) => {
        btn.classList.toggle('active', current.days.includes(btn.dataset.day));
      });
    }
    el.form.onsubmit = (ev) => {
      ev.preventDefault();
      current.name = el.name.value.trim();
      current.frequency = el.freq.value;
      current.days = current.frequency === 'custom' ? daysSelected() : [];
      upsertHabit(current);
      closeModal();
      el.form.onsubmit = null; // reset to default
      showToast('Habit updated', { type: 'success' });
    };
  }
});

// Initial render
render();
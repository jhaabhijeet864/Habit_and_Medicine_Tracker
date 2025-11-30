// Medicine management (client-side)
import { storage } from '../utils/storage.js';
import { showToast } from '../components/toast.js';

const KEY = 'hs_medicines';
const el = {
  list: document.getElementById('medicineList'),
  addBtn: document.getElementById('addMedicineBtn'),
  modal: document.getElementById('medicineModal'),
  closeModal: document.getElementById('closeMedicineModal'),
  form: document.getElementById('medicineForm'),
  name: document.getElementById('medName'),
  time: document.getElementById('medTime'),
  freq: document.getElementById('medFrequency'),
  complete: document.getElementById('medComplete'),
};

function openModal() { el.modal.classList.remove('hidden'); el.modal.classList.add('flex'); }
function closeModal() { el.modal.classList.add('hidden'); el.modal.classList.remove('flex'); el.form.reset(); }

function load() { return storage.get(KEY, []); }
function save(items) { storage.set(KEY, items); }

function render() {
  const items = load() || [];
  el.list.innerHTML = '';
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'bg-white rounded-xl shadow-sm p-12 text-center mt-6';
    empty.innerHTML = `
      <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">No medicine yet</h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">Add your prescriptions and reminders to stay consistent.</p>`;
    el.list.appendChild(empty);
    return;
  }

  items.forEach((m) => {
    const row = document.createElement('div');
    row.className = 'bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-start gap-4 border border-gray-100';
    row.innerHTML = `
      <label class="relative flex items-center cursor-pointer">
        <input type="checkbox" class="peer w-6 h-6 text-green-600 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 checked:bg-green-600 checked:border-green-600" data-action="toggle" data-id="${m.id}" ${m.completed ? 'checked' : ''}>
      </label>
      <div class="flex-1">
        <p class="text-lg font-semibold ${m.completed ? 'text-gray-500 line-through' : 'text-gray-900'}">${m.name}</p>
        <p class="text-sm text-gray-500">${m.time}, ${m.frequency}</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" data-action="edit" data-id="${m.id}" aria-label="Edit">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </button>
        <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" data-action="delete" data-id="${m.id}" aria-label="Delete">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>`;
    el.list.appendChild(row);
  });
}

function upsertMedicine(med) {
  const items = load();
  const idx = items.findIndex((x) => x.id === med.id);
  if (idx >= 0) items[idx] = med; else items.push(med);
  save(items);
  render();
}

function removeMedicine(id) {
  save(load().filter((x) => x.id !== id));
  render();
}

// Events
el.addBtn?.addEventListener('click', openModal);
el.closeModal?.addEventListener('click', closeModal);

el.form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = el.name.value.trim();
  const time = el.time.value;
  const frequency = el.freq.value || 'Daily';
  const completed = !!el.complete.checked;
  if (!name) return showToast('Please enter a medicine name', { type: 'warning' });
  if (!time) return showToast('Please select a time', { type: 'warning' });
  const med = { id: crypto.randomUUID(), name, time, frequency, completed, createdAt: Date.now() };
  upsertMedicine(med);
  closeModal();
  showToast('Medicine added', { type: 'success' });
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
    upsertMedicine(current);
  } else if (action === 'delete') {
    removeMedicine(id);
    showToast('Medicine removed', { type: 'success' });
  } else if (action === 'edit') {
    openModal();
    el.name.value = current.name;
    el.time.value = current.time;
    el.freq.value = current.frequency;
    el.complete.checked = !!current.completed;
    el.form.onsubmit = (ev) => {
      ev.preventDefault();
      current.name = el.name.value.trim();
      current.time = el.time.value;
      current.frequency = el.freq.value || 'Daily';
      current.completed = !!el.complete.checked;
      upsertMedicine(current);
      closeModal();
      el.form.onsubmit = null;
      showToast('Medicine updated', { type: 'success' });
    };
  }
});

// Initial render
render();
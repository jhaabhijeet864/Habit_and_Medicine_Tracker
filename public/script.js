/*
	Daily Habit & Medicine Tracker - Frontend Logic
	- localStorage-first data provider with optional API fallback
	- Today and All views rendering
	- Add/Edit reminder modal
	- Mark complete, delete (soft via remove)
	- Basic analytics: today's completion, streak, last 7 days bars
	- In-browser notification scheduling using Notification API and setTimeout
*/

// ------------- Utilities
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
const uid = () => Math.random().toString(36).slice(2, 10);
const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const nowHM = () => new Date().toTimeString().slice(0,5);

function toast(msg) {
	const t = $('#toast');
	t.textContent = msg;
	t.classList.add('show');
	setTimeout(() => t.classList.remove('show'), 2200);
}

// ------------- Persistence Layer
const Storage = {
	read() {
		try {
			return JSON.parse(localStorage.getItem('reminders') || '[]');
		} catch {
			return [];
		}
	},
	write(list) {
		localStorage.setItem('reminders', JSON.stringify(list));
	},
	historyRead() {
		try { return JSON.parse(localStorage.getItem('history') || '{}'); }
		catch { return {}; }
	},
	historyWrite(h) { localStorage.setItem('history', JSON.stringify(h)); },
};

// API provider (optional; if backend is running). We'll no-op on failure.
const API = {
	base: '/api/reminders',
	async list() {
		try { const r = await fetch(this.base); if (!r.ok) throw 0; return r.json(); } catch { return null; }
	},
	async create(data) {
		try { const r = await fetch(this.base,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}); if(!r.ok) throw 0; return r.json(); } catch { return null; }
	},
	async update(id, data) {
		try { const r = await fetch(`${this.base}/${id}`,{method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}); if(!r.ok) throw 0; return r.json(); } catch { return null; }
	}
};

// ------------- App State
const state = {
	reminders: [], // {id,name,type,time,completed}
	filter: { text:'', type:'all', status:'all' },
};

// ------------- Time and Theme
function tickClock() {
	$('#nowTime').textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
setInterval(tickClock, 1000); tickClock();

$('#themeToggle')?.addEventListener('click', () => {
	document.documentElement.classList.toggle('light');
});

// ------------- Rendering
function render() {
	renderToday();
	renderAll();
	renderAnalytics();
}

function renderToday() {
	const list = $('#todayList');
	list.innerHTML = '';
	const today = state.reminders
		.map(withNextTime)
		.sort((a,b) => a.time.localeCompare(b.time));

	const visible = today;
	$('#todayEmpty').style.display = visible.length ? 'none' : 'grid';

	for (const item of visible) {
		list.appendChild(reminderCard(item, {compact:true}));
	}
}

function renderAll() {
	const list = $('#allList');
	list.innerHTML = '';
	let items = [...state.reminders].sort((a,b) => a.time.localeCompare(b.time));
	const { text, type, status } = state.filter;
	if (text) items = items.filter(r => r.name.toLowerCase().includes(text.toLowerCase()));
	if (type !== 'all') items = items.filter(r => r.type === type);
	if (status !== 'all') {
		const key = todayKey();
		const h = Storage.historyRead();
		items = items.filter(r => {
			const done = !!h[key]?.[r.id];
			return status === 'done' ? done : !done;
		});
	}
	$('#allEmpty').style.display = items.length ? 'none' : 'grid';
	for (const r of items) list.appendChild(reminderCard(r));
}

function reminderCard(rem, opts={}) {
	const li = document.createElement('li');
	li.className = opts.compact ? 'card' : 'card';
	const h = Storage.historyRead();
	const done = !!h[todayKey()]?.[rem.id];
	li.innerHTML = `
		<div class="left">
			<span class="chip ${rem.type==='habit'?'habit':''}">${rem.type}</span>
		</div>
		<div class="mid">
			<div class="name ${done?'strike':''}">${escapeHtml(rem.name)}</div>
			<div class="row">
				<span class="badge">${rem.time}</span>
			</div>
		</div>
		<div class="right">
			<button class="icon-btn" title="Mark done" data-action="toggle">
				<span class="material-icons-round">${done?'check_circle':'radio_button_unchecked'}</span>
			</button>
			<button class="icon-btn" title="Edit" data-action="edit">
				<span class="material-icons-round">edit</span>
			</button>
			<button class="icon-btn" title="Delete" data-action="delete">
				<span class="material-icons-round">delete</span>
			</button>
		</div>
	`;
	li.dataset.id = rem.id;
	li.addEventListener('click', onCardAction);
	return li;
}

function escapeHtml(s){
	return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function onCardAction(e){
	const btn = e.target.closest('button');
	if(!btn) return;
	const id = e.currentTarget.dataset.id;
	const action = btn.dataset.action;
	if(action==='toggle') return toggleDone(id);
	if(action==='edit') return openModal(id);
	if(action==='delete') return removeReminder(id);
}

// ------------- Data operations
async function loadInitial() {
	// localStorage first
	let list = Storage.read();
	if (!list.length) {
		// Try API
		const apiItems = await API.list();
		if (apiItems && apiItems.length) {
			// Normalize API _id to id
			list = apiItems.map(x => ({ id:x._id||uid(), name:x.name, type:x.type||'habit', time:x.time, completed:!!x.completed }));
			Storage.write(list);
		}
	}
	state.reminders = list;
}

function saveAll() { Storage.write(state.reminders); }

async function addReminder(data) {
	const item = { id: uid(), name:data.name.trim(), type:data.type, time:data.time, completed:false };
	state.reminders.push(item);
	saveAll();
	// Try syncing to API (best-effort)
	API.create({ name:item.name, type:item.type, time:item.time }).catch(()=>{});
	scheduleNotification(item);
	toast('Reminder saved');
	render();
}

async function updateReminder(id, patch) {
	const i = state.reminders.findIndex(r => r.id===id);
	if (i<0) return;
	const prev = state.reminders[i];
	state.reminders[i] = { ...prev, ...patch };
	saveAll();
	API.update(prev._id||id, patch).catch(()=>{});
	scheduleNotification(state.reminders[i]);
	toast('Reminder updated');
	render();
}

function removeReminder(id){
	state.reminders = state.reminders.filter(r => r.id!==id);
	saveAll();
	toast('Reminder deleted');
	render();
}

function toggleDone(id){
	const key = todayKey();
	const h = Storage.historyRead();
	h[key] = h[key] || {};
	h[key][id] = !h[key][id];
	Storage.historyWrite(h);
	render();
}

// ------------- Modal
const modal = $('#reminderModal');
const form = $('#reminderForm');
const nameInput = $('#reminderName');
const typeInput = $('#reminderType');
const timeInput = $('#reminderTime');
const idInput = $('#reminderId');

$$('[data-open-modal]').forEach(b => b.addEventListener('click', () => openModal()));
$('[data-close-modal]')?.addEventListener('click', closeModal);

function openModal(id){
	if(id){
		const r = state.reminders.find(x => x.id===id);
		if(!r) return;
		$('#modalTitle').textContent = 'Edit Reminder';
		nameInput.value = r.name;
		typeInput.value = r.type;
		timeInput.value = r.time;
		idInput.value = r.id;
	} else {
		$('#modalTitle').textContent = 'Add Reminder';
		form.reset();
		idInput.value = '';
	}
	modal.showModal();
}
function closeModal(){ modal.close(); }

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const data = { name:nameInput.value, type:typeInput.value, time:timeInput.value };
	if(!data.name.trim() || !data.time){ toast('Please provide name and time'); return; }
	const id = idInput.value;
	closeModal();
	if(id) updateReminder(id, data); else addReminder(data);
});

// ------------- Filters & search
$('#searchInput')?.addEventListener('input', (e)=>{ state.filter.text = e.target.value; renderAll(); });
$('#filterType')?.addEventListener('change', (e)=>{ state.filter.type = e.target.value; renderAll(); });
$('#filterStatus')?.addEventListener('change', (e)=>{ state.filter.status = e.target.value; renderAll(); });

// ------------- Tabs
$$('.tabs .tab').forEach(tab => {
	tab.addEventListener('click', ()=>{
		$$('.tabs .tab').forEach(t=>t.classList.remove('active'));
		tab.classList.add('active');
		const id = tab.dataset.tab;
		$$('.view').forEach(v => v.classList.remove('active'));
		$(`#view-${id}`).classList.add('active');
	})
});

// ------------- Notifications
function requestPermissionIfNeeded(){
	if ('Notification' in window && Notification.permission === 'default') {
		Notification.requestPermission();
	}
}

function scheduleNotification(rem){
	if (!('Notification' in window)) return;
	if (Notification.permission !== 'granted') return;
	// schedule with setTimeout for today (best-effort, resets on reload)
	const [hh, mm] = rem.time.split(':').map(Number);
	const t = new Date();
	t.setHours(hh, mm, 0, 0);
	const delay = t.getTime() - Date.now();
	if (delay <= 0) return; // time already passed
	setTimeout(()=>{
		const key = todayKey();
		const done = !!Storage.historyRead()[key]?.[rem.id];
		if (done) return;
		new Notification('Reminder', { body: `${rem.name} • ${rem.type} at ${rem.time}` });
	}, delay);
}

// schedule for all existing on load
function scheduleAll(){ state.reminders.forEach(scheduleNotification); }

// ------------- Analytics
function renderAnalytics(){
	const key = todayKey();
	const h = Storage.historyRead();
	const doneMap = h[key] || {};
	const total = state.reminders.length;
	const completed = state.reminders.filter(r => doneMap[r.id]).length;
	const rate = total ? Math.round((completed/total)*100) : 0;
	$('#completionRate').textContent = `${rate}%`;
	$('#completionRing').style.setProperty('--value', rate);

	// streak (longest) based on days with rate 100%
	$('#streakCount').textContent = String(longestStreak());

	// last 7 days bars
	const bars = $('#weekBars'); bars.innerHTML = '';
	const days = lastNDays(7);
	for (const d of days) {
		const dm = h[d]||{};
		const n = state.reminders.filter(r => dm[r.id]).length;
		const pct = total ? Math.round((n/total)*100) : 0;
		const el = document.createElement('div');
		el.className = 'bar'+(pct>=50?' on':'');
		el.style.height = `${Math.max(6, pct/2)}px`;
		el.title = `${d}: ${pct}%`;
		bars.appendChild(el);
	}
}

function lastNDays(n){
	const res=[]; const d=new Date();
	for(let i=n-1;i>=0;i--){
		const t = new Date(d); t.setDate(d.getDate()-i);
		res.push(t.toISOString().slice(0,10));
	}
	return res;
}

function longestStreak(){
	const h = Storage.historyRead();
	let streak = 0, best = 0;
	const days = lastNDays(60); // lookback window
	for(const day of days){
		const dm = h[day] || {};
		const total = state.reminders.length;
		const done = state.reminders.filter(r => dm[r.id]).length;
		if (total && done===total) { streak++; best = Math.max(best, streak); }
		else streak = 0;
	}
	return best;
}

// ------------- Boot
async function init(){
	await loadInitial();
	requestPermissionIfNeeded();
	render();
	scheduleAll();
}

init();


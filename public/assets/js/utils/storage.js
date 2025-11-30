// Lightweight localStorage wrapper
const safe = (fn, fallback) => {
  try { return fn(); } catch { return fallback; }
};

export const storage = {
  get(key, defaultValue = null) {
    return safe(() => JSON.parse(localStorage.getItem(key)), defaultValue);
  },
  set(key, value) {
    return safe(() => localStorage.setItem(key, JSON.stringify(value)), undefined);
  },
  remove(key) {
    return safe(() => localStorage.removeItem(key), undefined);
  },
};
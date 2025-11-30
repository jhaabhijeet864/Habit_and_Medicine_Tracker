// General helper functions
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
export const on = (el, evt, handler) => el && el.addEventListener(evt, handler);
export const formatDate = (date) => new Date(date).toLocaleDateString();
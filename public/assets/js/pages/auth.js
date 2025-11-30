// Client-side auth (no backend)
import { showToast } from '../components/toast.js';
import { Loader } from '../components/loader.js';
import { required, isEmail, minLength } from '../utils/validator.js';
import { storage } from '../utils/storage.js';

const TOKEN_KEY = 'hs_token';
const USER_KEY = 'hs_user';

function saveSession(user) {
  storage.set(USER_KEY, user);
  storage.set(TOKEN_KEY, { value: 'local-dev-token', ts: Date.now() });
}

function handleLogin(form) {
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = fd.get('email');
    const password = fd.get('password');
    if (!required(email) || !isEmail(email)) return showToast('Enter a valid email', { type: 'warning' });
    if (!minLength(password, 6)) return showToast('Password must be 6+ chars', { type: 'warning' });
    try {
      Loader.show('Signing in...');
      const user = storage.get(USER_KEY) || { email, name: email.split('@')[0] };
      saveSession(user);
      showToast('Logged in', { type: 'success' });
      location.href = '/pages/dashboard/index.html';
    } catch (err) {
      showToast(err.message || 'Something went wrong', { type: 'error' });
    } finally { Loader.hide(); }
  });
}

function handleSignup(form) {
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = fd.get('email');
    const password = fd.get('password');
    const name = fd.get('fullName') || email.split('@')[0];
    if (!required(email) || !isEmail(email)) return showToast('Enter a valid email', { type: 'warning' });
    if (!minLength(password, 6)) return showToast('Password must be 6+ chars', { type: 'warning' });
    try {
      Loader.show('Creating account...');
      const user = { email, name };
      saveSession(user);
      showToast('Account created', { type: 'success' });
      location.href = '/pages/dashboard/index.html';
    } catch (err) {
      showToast(err.message || 'Something went wrong', { type: 'error' });
    } finally { Loader.hide(); }
  });
}

(() => {
  const loginForm = document.querySelector('[data-login-form]') || document.getElementById('loginForm');
  const signupForm = document.querySelector('[data-signup-form]') || document.getElementById('signupForm');
  handleLogin(loginForm);
  handleSignup(signupForm);
})();
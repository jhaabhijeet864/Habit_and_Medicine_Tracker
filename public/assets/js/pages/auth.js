import { showToast } from '../components/toast.js';
import { Loader } from '../components/loader.js';
import { required, isEmail, minLength } from '../utils/validator.js';
import { storage } from '../utils/storage.js';
import { api } from '../utils/api.js';

const TOKEN_KEY = 'hs_token';
const USER_KEY = 'hs_user';

function saveSession(user, token) {
  storage.set(USER_KEY, user);
  storage.set(TOKEN_KEY, { value: token, ts: Date.now() });
  api.setToken(token);
}

function getErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  return err.message || 'Something went wrong';
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
      const { data } = await api.post('/auth/login', { email, password });
      const user = data?.data;
      if (!user?.token) throw new Error('No token returned');
      saveSession(user, user.token);
      showToast('Logged in', { type: 'success' });
      location.href = '/pages/dashboard/index.html';
    } catch (err) {
      showToast(getErrorMessage(err), { type: 'error' });
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
      const { data } = await api.post('/auth/signup', { name, email, password });
      const user = data?.data;
      if (!user?.token) throw new Error('No token returned');
      saveSession(user, user.token);
      showToast('Account created', { type: 'success' });
      location.href = '/pages/dashboard/index.html';
    } catch (err) {
      showToast(getErrorMessage(err), { type: 'error' });
    } finally { Loader.hide(); }
  });
}

(() => {
  // hydrate stored token on load so API client is ready
  const storedToken = storage.get(TOKEN_KEY);
  if (storedToken?.value) api.setToken(storedToken.value);

  const loginForm = document.querySelector('[data-login-form]') || document.getElementById('loginForm');
  const signupForm = document.querySelector('[data-signup-form]') || document.getElementById('signupForm');
  handleLogin(loginForm);
  handleSignup(signupForm);
})();
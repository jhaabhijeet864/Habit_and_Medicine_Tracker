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

function handleForgotPassword(form) {
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = fd.get('email');
    if (!required(email) || !isEmail(email)) return showToast('Enter a valid email', { type: 'warning' });
    try {
      Loader.show('Sending reset link...');
      const { data } = await api.post('/auth/forgot-password', { email });
      const msg = data?.message || 'If that email exists, a reset link was sent.';
      showToast(msg, { type: 'success', duration: 5000 });
    } catch (err) {
      showToast(getErrorMessage(err), { type: 'error' });
    } finally { Loader.hide(); }
  });
}

function handleResetPassword(form) {
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (!token) {
    showToast('Reset token missing. Use the link from your email.', { type: 'error', duration: 6000 });
    form.querySelector('button[type="submit"]')?.setAttribute('disabled', 'true');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const password = fd.get('password');
    const confirm = fd.get('confirmPassword');
    if (!minLength(password, 6)) return showToast('Password must be 6+ chars', { type: 'warning' });
    if (password !== confirm) return showToast('Passwords do not match', { type: 'warning' });
    try {
      Loader.show('Updating password...');
      await api.post(`/auth/reset-password/${token}`, { password });
      showToast('Password updated. Please log in.', { type: 'success' });
      setTimeout(() => { window.location.href = '/pages/auth/login.html'; }, 600);
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
  const forgotForm = document.querySelector('[data-forgot-form]');
  const resetForm = document.querySelector('[data-reset-form]');

  handleLogin(loginForm);
  handleSignup(signupForm);
  handleForgotPassword(forgotForm);
  handleResetPassword(resetForm);
})();
import { getApiUrl } from '../config/config.js';

let token = null;

export const api = {
  setToken(nextToken) {
    token = nextToken;
  },
  async request(path, { method = 'GET', data, headers = {} } = {}) {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    const opts = { method, headers: { 'Content-Type': 'application/json', ...authHeader, ...headers } };
    if (data) opts.body = JSON.stringify(data);

    const res = await fetch(getApiUrl(path), opts);
    const contentType = res.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await res.json() : await res.text();
    if (!res.ok) {
      const message = typeof payload === 'string' ? payload : (payload.message || 'Request failed');
      const err = new Error(message);
      err.response = { data: payload, status: res.status };
      throw err;
    }
    return payload;
  },
  get(path, opts) {
    return this.request(path, { ...opts, method: 'GET' });
  },
  post(path, data, opts = {}) {
    return this.request(path, { ...opts, method: 'POST', data });
  },
  put(path, data, opts = {}) {
    return this.request(path, { ...opts, method: 'PUT', data });
  },
  del(path, opts) {
    return this.request(path, { ...opts, method: 'DELETE' });
  }
};
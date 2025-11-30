// Minimal API client using fetch
import { getApiUrl } from '../config/config.js';

export async function apiRequest(path, { method = 'GET', data, headers = {} } = {}) {
  const opts = { method, headers: { 'Content-Type': 'application/json', ...headers } };
  if (data) opts.body = JSON.stringify(data);

  const res = await fetch(getApiUrl(path), opts);
  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : (payload.message || 'Request failed'));
  return payload;
}
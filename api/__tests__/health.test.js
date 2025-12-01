const request = require('supertest');

// prevent DB bootstrap during tests
process.env.SKIP_BOOTSTRAP = '1';
const app = require('../index');

describe('Health endpoint', () => {
  it('returns ok:true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});

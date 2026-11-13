const request = require('supertest');
const env = require('../../src/config/env');
const { app } = require('../setup/helpers');

describe('Hub & CORS HTTP tests', () => {
  test('GET /api/v1/health returns 200 with database up', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.database).toBe('up');
  });

  test('GET /api/v1/results rejects missing X-Hub-Key with 401', async () => {
    const res = await request(app).get('/api/v1/results');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBeDefined();
  });

  test('CORS sets Access-Control-Allow-Origin for listed origin and omits it for unlisted origin', async () => {
    const allowedOrigin = env.corsOrigins[0];
    const allowedRes = await request(app)
      .get('/api/v1/health')
      .set('Origin', allowedOrigin);
    expect(allowedRes.headers['access-control-allow-origin']).toBe(allowedOrigin);

    const blockedRes = await request(app)
      .get('/api/v1/health')
      .set('Origin', 'https://evil-unlisted-site.example');
    expect(blockedRes.headers['access-control-allow-origin']).toBeUndefined();
  });
});

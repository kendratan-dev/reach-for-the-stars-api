// Small helpers shared by the HTTP tests.
const request = require('supertest');
const app = require('../../src/app');

// CHANGE THIS to the demo password your own seeder gives your test accounts (Week 12, Step 2).
const DEMO_PASSWORD = 'Aklat-Demo-2026';

// Logs in a seeded account and returns its "Authorization" header value.
async function bearer(schoolId) {
  const res = await request(app).post('/api/v1/auth/login').send({ school_id: schoolId, password: DEMO_PASSWORD });
  if (res.status !== 200) throw new Error(`login of ${schoolId} answered ${res.status}`);
  return `Bearer ${res.body.token}`;
}

module.exports = { app, request, bearer };

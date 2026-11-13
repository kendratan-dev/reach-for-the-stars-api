const request = require('supertest');
const app = require('../../src/app');

const DEMO_PASSWORD = 'Pass1234!';

let seq = 1000;
function uniqueSuffix() {
  seq += 1;
  return `${Date.now().toString().slice(-4)}${seq}`;
}

async function loginAs(schoolId, password = DEMO_PASSWORD) {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ school_id: schoolId, password });
  return res.body.token;
}

module.exports = {
  app,
  request,
  DEMO_PASSWORD,
  uniqueSuffix,
  loginAs,
};

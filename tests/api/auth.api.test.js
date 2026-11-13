const { app, request, DEMO_PASSWORD, uniqueSuffix, loginAs } = require('../setup/helpers');

describe('Auth & Users HTTP tests', () => {
  const suffix = uniqueSuffix();
  const schoolId = `2026-${suffix}`;
  let createdUserId;

  test('POST /api/v1/auth/register creates a PLAYER without leaking password_hash', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        school_id: schoolId,
        username: `user_${suffix}`,
        full_name: 'Test Student',
        email: `student_${suffix}@sorsu.edu.ph`,
        password: DEMO_PASSWORD,
        role: 'ADMIN',
      });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('PLAYER');
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.password_hash).toBeUndefined();
    createdUserId = res.body.user.user_id || res.body.user.id;
  });

  test('POST /api/v1/auth/register returns 409 on duplicate school_id', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        school_id: schoolId,
        username: `dup_${suffix}`,
        full_name: 'Duplicate Student',
        email: `dup_${suffix}@sorsu.edu.ph`,
        password: DEMO_PASSWORD,
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBeDefined();
  });

  test('POST /api/v1/auth/register returns 400 on weak password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        school_id: `2026-w${suffix}`,
        username: `weak_${suffix}`,
        full_name: 'Weak Password',
        email: `weak_${suffix}@sorsu.edu.ph`,
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBeDefined();
  });

  test('POST /api/v1/auth/login returns 200 with token and GET /auth/me returns profile', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ school_id: schoolId, password: DEMO_PASSWORD });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.school_id).toBe(schoolId);
  });

  test('GET /api/v1/auth/me returns 401 when missing token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBeDefined();
  });

  test('ADMIN can list users and update user role', async () => {
    const adminToken = await loginAs('2026-0000');
    const listRes = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.status).toBe(200);

    if (createdUserId) {
      const roleRes = await request(app)
        .patch(`/api/v1/users/${createdUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'HOST' });
      expect(roleRes.status).toBe(200);
    }
  });
});

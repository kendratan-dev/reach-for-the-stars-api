const { app, request, loginAs } = require('../setup/helpers');

describe('Question Bank HTTP tests', () => {
  let hostToken;
  let playerToken;
  let createdSetId;

  beforeAll(async () => {
    hostToken = await loginAs('2026-0001');
    playerToken = await loginAs('2026-0003');
  });

  test('POST /api/v1/question-sets creates a new set (201) and rejects PLAYER (403)', async () => {
    const forbiddenRes = await request(app)
      .post('/api/v1/question-sets')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ title: 'Blocked Set', subject: 'CS' });
    expect(forbiddenRes.status).toBe(403);
    expect(forbiddenRes.body.error.code).toBeDefined();

    const res = await request(app)
      .post('/api/v1/question-sets')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: 'Jest Automated Test Set',
        subject: 'Computer Science',
        description: 'Created during Jest HTTP test suite',
      });
    expect(res.status).toBe(201);
    createdSetId = res.body.id;

    const listRes = await request(app)
      .get('/api/v1/question-sets?q=Jest&sort=title')
      .set('Authorization', `Bearer ${hostToken}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);

    const detailRes = await request(app)
      .get(`/api/v1/question-sets/${createdSetId}?include=questions`)
      .set('Authorization', `Bearer ${hostToken}`);
    expect(detailRes.status).toBe(200);
  });

  test('POST /api/v1/question-sets/:id/questions rejects two correct choices with 400 and succeeds with 1 correct choice (201)', async () => {
    const badRes = await request(app)
      .post(`/api/v1/question-sets/${createdSetId}/questions`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        text: 'Invalid two-correct question?',
        time_limit_sec: 20,
        choices: [
          { text: 'A', is_correct: true },
          { text: 'B', is_correct: true },
        ],
      });
    expect(badRes.status).toBe(400);
    expect(badRes.body.error.code).toBeDefined();

    const okRes = await request(app)
      .post(`/api/v1/question-sets/${createdSetId}/questions`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        text: 'What does HTTP 201 mean?',
        time_limit_sec: 20,
        choices: [
          { text: 'Created', is_correct: true },
          { text: 'Not Found', is_correct: false },
        ],
      });
    expect(okRes.status).toBe(201);
  });

  test('GET /api/v1/question-sets/999999 returns 404', async () => {
    const res = await request(app)
      .get('/api/v1/question-sets/999999')
      .set('Authorization', `Bearer ${hostToken}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBeDefined();
  });
});

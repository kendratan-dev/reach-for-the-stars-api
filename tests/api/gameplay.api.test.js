const { app, request, loginAs } = require('../setup/helpers');

describe('Gameplay HTTP tests', () => {
  let hostToken;
  let playerToken;
  let setId;
  let joinCode;
  let questionId;
  let correctChoiceId;

  beforeAll(async () => {
    hostToken = await loginAs('2026-0001');
    playerToken = await loginAs('2026-0003');

    const setRes = await request(app)
      .post('/api/v1/question-sets')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({ title: 'Gameplay Test Set', subject: 'SE1' });
    setId = setRes.body.id;

    const qRes = await request(app)
      .post(`/api/v1/question-sets/${setId}/questions`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        text: 'Which status code indicates a conflict?',
        time_limit_sec: 20,
        choices: [
          { text: '409', is_correct: true },
          { text: '200', is_correct: false },
        ],
      });
    questionId = qRes.body.id;
    correctChoiceId = qRes.body.choices.find((c) => c.is_correct).id;
  });

  test('GET /api/v1/game-info returns game metadata', async () => {
    const res = await request(app).get('/api/v1/game-info');
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('reach-for-the-stars-api');
  });

  test('plays a full session lifecycle from LOBBY to RUNNING, answer submission, leaderboard, and CLOSED', async () => {
    const sessionRes = await request(app)
      .post('/api/v1/sessions')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({ question_set_id: setId });
    expect(sessionRes.status).toBe(201);
    joinCode = sessionRes.body.code;

    const getSessionRes = await request(app)
      .get(`/api/v1/sessions/${joinCode}`)
      .set('Authorization', `Bearer ${hostToken}`);
    expect(getSessionRes.status).toBe(200);

    const joinRes = await request(app)
      .post(`/api/v1/sessions/${joinCode}/players`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ nickname: 'JestRunner' });
    expect(joinRes.status).toBe(201);

    const startRes = await request(app)
      .patch(`/api/v1/sessions/${joinCode}`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({ status: 'RUNNING' });
    expect(startRes.status).toBe(200);

    const activeQ = await request(app)
      .get(`/api/v1/sessions/${joinCode}/question`)
      .set('Authorization', `Bearer ${playerToken}`);
    expect(activeQ.status).toBe(200);
    expect(activeQ.body.choices[0].is_correct).toBeUndefined();

    const ansRes = await request(app)
      .post(`/api/v1/sessions/${joinCode}/answers`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ question_id: questionId, choice_id: correctChoiceId });
    expect(ansRes.status).toBe(201);
    expect(ansRes.body.is_correct).toBe(true);
    expect(ansRes.body.points_earned).toBeGreaterThan(0);

    const dupAns = await request(app)
      .post(`/api/v1/sessions/${joinCode}/answers`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ question_id: questionId, choice_id: correctChoiceId });
    expect(dupAns.status).toBe(409);
    expect(dupAns.body.error.code).toBe('ALREADY_ANSWERED');

    const lbRes = await request(app)
      .get(`/api/v1/sessions/${joinCode}/leaderboard`)
      .set('Authorization', `Bearer ${playerToken}`);
    expect(lbRes.status).toBe(200);
    expect(lbRes.body.leaderboard[0].nickname).toBe('JestRunner');

    const closeRes = await request(app)
      .patch(`/api/v1/sessions/${joinCode}`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({ status: 'CLOSED' });
    expect(closeRes.status).toBe(200);
  });
});

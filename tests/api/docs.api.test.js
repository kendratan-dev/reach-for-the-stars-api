// HTTP tests of the Week 15 documentation endpoints.
const { app, request } = require('../setup/helpers');
const { sequelize } = require('../../src/models');

afterAll(() => sequelize.close());

test('GET /openapi.json is an OpenAPI 3 document with the package version', async () => {
  const res = await request(app).get('/api/v1/openapi.json');
  expect(res.status).toBe(200);
  expect(res.body.openapi).toMatch(/^3\./);
  expect(res.body.info.version).toBe(require('../../package.json').version);
});

test('every documented operation has a summary and at least one response', async () => {
  const { body } = await request(app).get('/api/v1/openapi.json');
  const operations = Object.entries(body.paths).flatMap(([url, item]) => Object.entries(item)
    .filter(([verb]) => ['get', 'post', 'put', 'patch', 'delete'].includes(verb))
    .map(([verb, op]) => ({ name: `${verb.toUpperCase()} ${url}`, op })));
  expect(operations.length).toBeGreaterThanOrEqual(15);
  operations.forEach(({ name, op }) => {
    expect({ name, summary: Boolean(op.summary) }).toEqual({ name, summary: true });
    expect(Object.keys(op.responses || {}).length).toBeGreaterThan(0);
  });
});

test('GET /docs/ shows Swagger UI', async () => {
  const res = await request(app).get('/api/v1/docs/');
  expect(res.status).toBe(200);
  expect(res.text).toMatch(/swagger/i);
});

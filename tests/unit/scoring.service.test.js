const { pointsFor } = require('../../src/services/scoring');

describe('scoring service (pointsFor)', () => {
  const question = { points_base: 1000, time_limit_sec: 20 };

  test('awards full points at 0 ms elapsed', () => {
    expect(pointsFor(question, true, 0)).toBe(1000);
  });

  test('awards 750 points half-way through the timer (10,000 ms)', () => {
    expect(pointsFor(question, true, 10000)).toBe(750);
  });

  test('awards half points right at the time limit (20,000 ms)', () => {
    expect(pointsFor(question, true, 20000)).toBe(500);
  });

  test('awards 0 points for a wrong answer', () => {
    expect(pointsFor(question, false, 1500)).toBe(0);
  });

  test('awards 0 points when submitted 1 ms late (20,001 ms)', () => {
    expect(pointsFor(question, true, 20001)).toBe(0);
  });
});

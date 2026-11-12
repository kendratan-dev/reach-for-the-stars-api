// UNIT tests for the ranking rule of Hub Contract rule 7. rankPlayers is a pure
// function: no database, no fakes needed.
const { rankPlayers } = require('../../src/services/results.service');

const p = (nickname, score, completed = true) => ({ nickname, score, completed });

test('equal scores share a rank, and the next rank skips', () => {
  const ranked = rankPlayers([p('Rina', 6824), p('Dale', 3900), p('Pao', 3900), p('Ana', 100)]);
  expect(ranked.map((r) => [r.nickname, r.rank])).toEqual([['Rina', 1], ['Dale', 2], ['Pao', 2], ['Ana', 4]]);
});

test('a player who did not complete the game has no rank', () => {
  const ranked = rankPlayers([p('Rina', 100), p('Lia', 9000, false)]);
  expect(ranked.find((r) => r.nickname === 'Lia').rank).toBeNull();
  expect(ranked.find((r) => r.nickname === 'Rina').rank).toBe(1);
});

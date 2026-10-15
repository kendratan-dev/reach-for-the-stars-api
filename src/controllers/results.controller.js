// Translates between HTTP and the service. No SQL, no business rules.
const gameInfo = require('../config/game-info');
const resultsService = require('../services/results.service');

async function getResults(req, res) {
  // Optional: ?since=2026-10-20T00:00:00Z returns only games that ended after that moment.
  const { since } = req.query;
  if (since !== undefined && Number.isNaN(Date.parse(since))) {
    return res.status(400).json({
      error: { code: 'INVALID_SINCE', message: 'since must be a date and time, for example 2026-10-20T00:00:00Z.' },
    });
  }

  const results = await resultsService.listFinishedGames(since ? new Date(since) : null);
  res.status(200).json({
    game: gameInfo.slug,
    developer: gameInfo.developer,
    generated_at: new Date().toISOString(),
    results,
  });
}

module.exports = { getResults };

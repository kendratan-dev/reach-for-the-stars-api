const { Router } = require('express');
const { Op } = require('sequelize');
const { Session, SessionPlayer, sequelize } = require('../models');

const router = Router();

// GET /health
router.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.status(200).json({ database: 'up' });
  } catch (error) {
    return res.status(500).json({ database: 'down' });
  }
});

// GET /game-info
router.get('/game-info', (req, res) => {
  return res.status(200).json({
    game: 'reach-for-the-stars-api',
    developer: 'Kendra Shanice Tan',
    version: '1.0.0'
  });
});

// GET /results
router.get('/results', async (req, res) => {
  const hubKey = req.headers['x-hub-key'] || req.query.key;
  const expectedKey = process.env.HUB_API_KEY || 'dev-hub-key';

  // Requirement: Missing or invalid key -> 401
  if (!hubKey || hubKey !== expectedKey) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Hub key.' }
    });
  }

  const { since } = req.query;
  let sinceDate = null;

  // Requirement: Invalid ?since= date format -> 400
  if (since !== undefined) {
    sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      return res.status(400).json({
        error: { code: 'VALIDATION_FAILED', message: 'Invalid since timestamp.' }
      });
    }
  }

  const whereClause = { status: 'ENDED' };
  if (sinceDate) {
    whereClause.ended_at = { [Op.gt]: sinceDate };
  }

  try {
    const finishedSessions = await Session.findAll({
      where: whereClause,
      include: [{ model: SessionPlayer }]
    });

    return res.status(200).json({
      generated_at: new Date().toISOString(),
      results: finishedSessions.map(s => {
        const playersList = s.SessionPlayers || s.session_players || s.players || [];
        return {
          session_code: s.join_code,
          ended_at: s.ended_at ? new Date(s.ended_at).toISOString() : new Date().toISOString(),
          players: playersList.map(p => ({
            nickname: p.nickname,
            score: p.stars ?? p.score ?? 0
          }))
        };
      })
    });
  } catch (err) {
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

module.exports = router;
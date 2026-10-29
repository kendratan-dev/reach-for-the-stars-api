const { Router } = require('express');
const { Op } = require('sequelize');
const { Session, SessionPlayer, User, sequelize } = require('../models');

const router = Router();

// 1. GET /health
router.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.status(200).json({ database: 'up' });
  } catch (error) {
    return res.status(500).json({ database: 'down' });
  }
});

// 2. GET /game-info
router.get('/game-info', (req, res) => {
  return res.status(200).json({
    slug: 'reach-for-the-stars-api',
    name: 'Reach for the Stars API',
    team: 'Kendra Shanice Tan',
    developer: 'kendratan-dev',
    description: 'A trivia game API built for CS 313.',
    version: '1.0.0',
    min_players: 1,
    max_players: 8
  });
});

// 3. GET /results
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
      include: [
        {
          model: SessionPlayer,
          include: [{ model: User }]
        }
      ]
    });

    return res.status(200).json({
      game: 'reach-for-the-stars-api',
      generated_at: new Date().toISOString(),
      results: finishedSessions.map(s => {
        const rawPlayers = s.SessionPlayers || s.session_players || s.players || [];
        
        const formattedPlayers = rawPlayers.map(p => ({
          school_id: p.User?.school_id || p.school_id || '2026-0001',
          nickname: p.nickname || 'Player',
          score: Number(p.stars ?? p.score ?? 0),
          completed: p.completed ?? true
        }));

        // Sort by score descending to generate top 3 podium ranks
        const sorted = [...formattedPlayers].sort((a, b) => b.score - a.score);
        const podium = sorted.slice(0, 3).map((p, idx) => ({
          rank: idx + 1,
          nickname: p.nickname
        }));

        return {
          session_code: String(s.join_code || s.code || '100000'),
          ended_at: s.ended_at ? new Date(s.ended_at).toISOString() : new Date().toISOString(),
          players: formattedPlayers,
          podium: podium
        };
      })
    });
  } catch (err) {
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

module.exports = router;
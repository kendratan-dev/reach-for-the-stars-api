'use strict';

// Hub Contract Rule 7 / Lab Step 8: Results repository for Reach for the Stars
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT 
      s.join_code AS session_code,
      s.started_at,
      s.ended_at,
      NULL AS school_id,
      p.nickname,
      p.stars AS score,
      (
        (SELECT COUNT(*) FROM answers a WHERE a.player_id = p.id) = 
        (SELECT COUNT(*) FROM questions q WHERE q.question_set_id = s.question_set_id)
      ) AS completed
    FROM sessions s
    JOIN session_players p ON p.session_id = s.id
    WHERE s.status = 'ENDED'
      AND (CAST(:since AS timestamptz) IS NULL OR s.ended_at > CAST(:since AS timestamptz))
    ORDER BY s.ended_at DESC, p.stars DESC, p.correct_count DESC, p.total_answer_ms ASC;
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { since: since ? since.toISOString() : null },
  });
}

module.exports = { findFinishedGamePlayers };
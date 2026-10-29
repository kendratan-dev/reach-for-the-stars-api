const { Op } = require('sequelize');
const dbModels = require('../models');

const SessionPlayer = dbModels.SessionPlayer || dbModels.Player;

// Find a seat by user_id for rejoin check
async function findSeat(sessionId, userId) {
  if (!sessionId || !userId) return null;
  return SessionPlayer.findOne({
    where: {
      session_id: sessionId,
      user_id: userId,
    },
  });
}

// Find if a nickname is already taken in this session
async function findByNickname(sessionId, nickname) {
  if (!sessionId || !nickname) return null;
  return SessionPlayer.findOne({
    where: {
      session_id: sessionId,
      nickname: nickname,
    },
  });
}

async function countBySession(sessionId) {
  if (!sessionId) return 0;
  return SessionPlayer.count({ where: { session_id: sessionId } });
}

async function markSeen(player) {
  return player.update({ last_seen_at: new Date() });
}

async function create(data) {
  return SessionPlayer.create(data);
}

module.exports = {
  findSeat,
  findByNickname,
  countBySession,
  markSeen,
  create,
  createPlayer: create,
};
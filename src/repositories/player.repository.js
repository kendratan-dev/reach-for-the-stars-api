const { Player } = require('../models');

// Finds one seat by session and user account
function findSeat(sessionId, userId) {
  return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}

// Counts occupied seats in a session
function countBySession(sessionId) {
  return Player.count({ where: { session_id: sessionId } });
}

// Updates the last active timestamp
function markSeen(player) {
  return player.update({ last_seen_at: new Date() });
}

// Creates a new seat row
function create(data) {
  return Player.create(data);
}

module.exports = {
  findSeat,
  countBySession,
  markSeen,
  create,
};
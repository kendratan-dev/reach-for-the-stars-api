const playerRepository = require('../repositories/player.repository');
const sessionService = require('./session.service');
const { constraintOf } = require('../errors/db-errors');
const { conflict } = require('../errors/app-error');

async function join(code, nickname, user) {
  const session = await sessionService.findOrFail(code);

  // 1. Rejoin check: return existing seat if this user already joined
  const seat = await playerRepository.findSeat(session.session_id, user.user_id);
  if (seat) {
    await playerRepository.markSeen(seat);
    return { session, player: seat, created: false };
  }

  // 2. New seat checks
  if (session.status === 'CLOSED') throw conflict('SESSION_ENDED', 'This game has ended.');
  if (session.status !== 'LOBBY') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }

  const seatsTaken = await playerRepository.countBySession(session.session_id);
  if (seatsTaken >= session.max_players) throw conflict('SESSION_FULL', 'This game is full.');

  try {
    const player = await playerRepository.create({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
      last_seen_at: new Date(),
    });
    return { session, player, created: true };
  } catch (error) {
    // Unique constraint backup for race conditions
    if (constraintOf(error) === 'uq_one_seat') {
      const existing = await playerRepository.findSeat(session.session_id, user.user_id);
      return { session, player: existing, created: false };
    }
    throw error;
  }
}

module.exports = { join };
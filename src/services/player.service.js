const sessionRepository = require('../repositories/session.repository');
const playerRepository = require('../repositories/player.repository');
const { notFound, conflict } = require('../errors/app-error');

async function findSessionOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No session found with join code ${code}.`);
  }
  return session;
}

async function join(code, nickname, user) {
  const session = await findSessionOrFail(code);
  const sessionId = session.session_id || session.id;
  const userId = user.user_id || user.id;

  // 1. REJOIN CHECK: Rejoin if THIS account already has a seat
  const existingSeat = await playerRepository.findSeat(sessionId, userId);
  if (existingSeat) {
    if (typeof playerRepository.markSeen === 'function') {
      await playerRepository.markSeen(existingSeat);
    }
    return { session, player: existingSeat, created: false };
  }

  // 2. LOBBY CHECK: New players can only join when status is LOBBY
  if (session.status === 'CLOSED') {
    throw conflict('SESSION_ENDED', 'This game has ended.');
  }
  if (session.status !== 'LOBBY') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game session is no longer accepting new players.');
  }

  // 3. CAPACITY CHECK
  if (session.max_players) {
    const seatsTaken = await playerRepository.countBySession(sessionId);
    if (seatsTaken >= session.max_players) {
      throw conflict('SESSION_FULL', 'This game is full.');
    }
  }

  // 4. DUPLICATE NICKNAME CHECK (Question 7 in Lab Guide)
  const takenNick = await playerRepository.findByNickname(sessionId, nickname);
  if (takenNick) {
    throw conflict('NICKNAME_TAKEN', 'That nickname is already used in this game.');
  }

  // 5. CREATE NEW SEAT
  const newPlayer = await playerRepository.create({
    session_id: sessionId,
    user_id: userId,
    nickname,
    last_seen_at: new Date(),
  });

  return { session, player: newPlayer, created: true };
}

async function listBySession(code) {
  const session = await findSessionOrFail(code);
  const sessionId = session.session_id || session.id;
  return await playerRepository.findAllBySession(sessionId);
}

module.exports = { join, joinSession: join, listBySession };
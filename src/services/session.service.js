const sessionRepo = require('../repositories/session.repository');
const { QuestionSet } = require('../models');
const { badRequest, notFound, forbidden } = require('../errors/app-error');

function generatePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function conflict(message) {
  const err = new Error(message);
  err.status = 409;
  err.code = 'CONFLICT';
  return err;
}

async function createSession(hostUser, payload) {
  const { question_set_id, duration_sec } = payload;

  const questionSet = await QuestionSet.findByPk(question_set_id);
  if (!questionSet) {
    throw notFound('Question set not found.');
  }

  if (questionSet.host_id !== hostUser.user_id && questionSet.host_id !== hostUser.host_id) {
    throw forbidden('You do not have permission to host a session with this question set.');
  }

  const join_code = generatePin();
  const session = await sessionRepo.create({
    host_id: hostUser.user_id || hostUser.host_id,
    question_set_id,
    join_code,
    duration_sec: duration_sec || 30,
    status: 'LOBBY'
  });

  return session;
}

async function joinSession(playerUser, code, payload) {
  const { nickname } = payload;

  const session = await sessionRepo.findByPin(code);
  if (!session) {
    throw notFound('Session not found.');
  }

  const userId = playerUser ? (playerUser.user_id || playerUser.id) : null;

  // 1. Check if returning player (rejoining)
  const existingPlayer = await sessionRepo.findExistingPlayer(session.id, userId, nickname);
  if (existingPlayer) {
    return {
      status: 200,
      data: {
        player_id: existingPlayer.id,
        session_id: session.id,
        nickname: existingPlayer.nickname,
        rejoined: true
      }
    };
  }

  // 2. Prevent NEW players from joining if session isn't LOBBY
  if (session.status !== 'LOBBY') {
    throw conflict('the game has already started.');
  }

  // 3. Create new player
  const player = await sessionRepo.createPlayer({
    session_id: session.id,
    user_id: userId,
    nickname
  });

  return {
    status: 201,
    data: {
      player_id: player.id,
      session_id: session.id,
      nickname: player.nickname,
      rejoined: false
    }
  };
}

async function updateSessionStatus(hostUser, code, payload) {
  const { status } = payload;
  const session = await sessionRepo.findByPin(code);

  if (!session) {
    throw notFound('Session not found.');
  }

  if (session.status === 'CLOSED' && status === 'RUNNING') {
    throw conflict('a closed game cannot run again');
  }

  session.status = status;
  await session.save();

  return session;
}

async function getSessionById(sessionId) {
  const session = await sessionRepo.findById(sessionId);
  if (!session) {
    throw notFound('Session not found.');
  }
  return session;
}

module.exports = {
  createSession,
  joinSession,
  updateSessionStatus,
  getSessionById
};
const { SessionPlayer } = require('../models');
const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { appError, notFound, forbidden, badRequest } = require('../errors/app-error');

function generateJoinCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes confusing characters like 0, O, 1, I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function throwErr(fn, defaultMsg, status) {
  if (fn) throw fn(defaultMsg);
  if (appError && appError[fn]) throw appError[fn](defaultMsg);
  const err = new Error(defaultMsg);
  err.status = status;
  throw err;
}

async function createSession(data, user) {
  const setId = data.question_set_id;
  const set = await questionSetRepository.findById(setId);
  if (!set) {
    if (notFound) throw notFound('Question set not found.');
    const err = new Error('Question set not found.');
    err.status = 404;
    throw err;
  }

  const userId = user.id || user.user_id;
  if (set.host_id !== userId && user.role !== 'ADMIN') {
    if (forbidden) throw forbidden('You do not have permission to host this set.');
    const err = new Error('You do not have permission to host this set.');
    err.status = 403;
    throw err;
  }

  // Ensure unique join code
  let joinCode = generateJoinCode();
  let existing = await sessionRepository.findByJoinCode(joinCode);
  while (existing) {
    joinCode = generateJoinCode();
    existing = await sessionRepository.findByJoinCode(joinCode);
  }

  const sessionData = {
    host_id: userId,
    question_set_id: setId,
    join_code: joinCode,
    status: 'WAITING',
    duration_sec: data.duration_sec || 300,
  };

  return sessionRepository.create(sessionData);
}

async function getSession(id) {
  const session = await sessionRepository.findById(id);
  if (!session) {
    if (notFound) throw notFound('Session not found.');
    const err = new Error('Session not found.');
    err.status = 404;
    throw err;
  }
  return session;
}

async function getByCode(code) {
  const session = await sessionRepository.findByJoinCode(code.toUpperCase());
  if (!session) {
    if (notFound) throw notFound('Invalid join code.');
    const err = new Error('Invalid join code.');
    err.status = 404;
    throw err;
  }
  return session;
}

async function startSession(id, user) {
  const session = await getSession(id);
  const userId = user.id || user.user_id;

  if (session.host_id !== userId && user.role !== 'ADMIN') {
    if (forbidden) throw forbidden('You do not have permission to start this session.');
    const err = new Error('You do not have permission to start this session.');
    err.status = 403;
    throw err;
  }

  if (session.status !== 'WAITING') {
    const msg = `Cannot start session with status ${session.status}`;
    if (badRequest) throw badRequest(msg);
    const err = new Error(msg);
    err.status = 400;
    throw err;
  }

  const now = new Date();
  const endsAt = new Date(now.getTime() + session.duration_sec * 1000);

  return sessionRepository.update(session, {
    status: 'IN_PROGRESS',
    started_at: now,
    ends_at: endsAt,
  });
}

async function endSession(id, user) {
  const session = await getSession(id);
  const userId = user.id || user.user_id;

  if (session.host_id !== userId && user.role !== 'ADMIN') {
    if (forbidden) throw forbidden('You do not have permission to end this session.');
    const err = new Error('You do not have permission to end this session.');
    err.status = 403;
    throw err;
  }

  return sessionRepository.update(session, {
    status: 'COMPLETED',
    ended_at: new Date(),
  });
}

async function joinSession(joinCode, nickname, user = null) {
  const session = await getByCode(joinCode);

  if (session.status !== 'WAITING') {
    const msg = 'Cannot join session that is not in WAITING state.';
    if (badRequest) throw badRequest(msg);
    const err = new Error(msg);
    err.status = 400;
    throw err;
  }

  const playerData = {
    session_id: session.id,
    nickname: nickname,
  };

  if (user && (user.id || user.user_id)) {
    playerData.user_id = user.id || user.user_id;
  }

  const player = await SessionPlayer.create(playerData);
  return { player, session };
}

module.exports = {
  createSession,
  getSession,
  getByCode,
  startSession,
  endSession,
  joinSession,
};
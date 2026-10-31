const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

// Hub Contract rule 5: six digits (100000 to 999999)
function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No session found with join code ${code}.`);
  }
  return session;
}

async function create(questionSetId, user) {
  const questionSet = await questionSetRepository.findById(questionSetId);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${questionSetId}.`);
  }

  const mayUse = questionSet.host_id === user.user_id || questionSet.is_public || user.role === 'ADMIN';
  if (!mayUse) {
    throw forbidden('This question set belongs to another host.');
  }

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
// In session.service.js inside create()
return await sessionRepository.create({
  question_set_id: questionSet.id,
  host_id: user.user_id,
  join_code: randomCode(),
  duration_sec: 60,
  status: 'LOBBY',
});
    } catch (error) {
      if (constraintOf(error) !== 'sessions_join_code_key' && constraintOf(error) !== 'game_sessions_join_pin_key') {
        throw error;
      }
    }
  }
  throw new Error('Could not find a free join code after 5 attempts.');
}

async function getSessionByCode(code) {
  return await findOrFail(code);
}

async function changeStatus(code, status, user) {
  const session = await findOrFail(code);

  if (session.host_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('This game belongs to another host.');
  }

  if (session.status === status) {
    throw conflict('INVALID_STATUS_CHANGE', `Session is already in ${status} status.`);
  }

  const NEXT_STATUS = {
    LOBBY: ['RUNNING', 'CLOSED'],
    RUNNING: ['CLOSED'],
    CLOSED: [],
  };

  if (!NEXT_STATUS[session.status] || !NEXT_STATUS[session.status].includes(status)) {
    throw conflict('INVALID_STATUS_CHANGE', `A ${session.status} game cannot become ${status}.`);
  }

  const changes = { status };
  if (status === 'RUNNING') changes.started_at = new Date();
  if (status === 'CLOSED') changes.ended_at = new Date();

  return await sessionRepository.update(session, changes);
}

module.exports = {
  create,
  createSession: create,
  getSessionByCode,
  changeStatus,
  findOrFail,
};
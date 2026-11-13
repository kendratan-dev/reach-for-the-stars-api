const questionRepository = require('../repositories/question.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { forbidden, notFound, conflict } = require('../errors/app-error');

async function assertCanEditSet(setId, user) {
  const set = await questionSetRepository.findById(setId);
  if (!set) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${setId}.`);
  }

  const userId = user.host_id || user.user_id || user.id;
  if (Number(set.host_id) !== Number(userId) && user.role !== 'ADMIN') {
    throw forbidden('You are not allowed to modify another host\'s question set.');
  }

  const inUse = await questionSetRepository.isUsedInSession(setId);
  if (inUse) {
    throw conflict('SET_IN_USE', 'This question set has already been used in a game and cannot be edited.');
  }

  return set;
}

async function listBySetId(setId, user) {
  const set = await questionSetRepository.findById(setId);
  if (!set) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${setId}.`);
  }

  const userId = user.host_id || user.user_id || user.id;
  if (Number(set.host_id) !== Number(userId) && user.role !== 'ADMIN') {
    throw forbidden('You are not allowed to view questions in another host\'s set.');
  }

  return questionRepository.findAllBySetId(setId);
}

async function createQuestion(setId, data, user) {
  await assertCanEditSet(setId, user);

  const questionData = {
    text: data.text.trim(),
    type: data.type || 'MULTIPLE_CHOICE',
    time_limit_sec: data.time_limit_sec || 30,
  };

  return questionRepository.createWithChoices(setId, questionData, data.choices);
}

async function updateQuestion(setId, questionId, data, user) {
  await assertCanEditSet(setId, user);

  const question = await questionRepository.findByIdAndSet(questionId, setId);
  if (!question) {
    throw notFound('QUESTION_NOT_FOUND', `No question ${questionId} found in question set ${setId}.`);
  }

  const changes = {};
  if (data.text !== undefined) changes.text = data.text.trim();
  if (data.type !== undefined) changes.type = data.type;
  if (data.time_limit_sec !== undefined) changes.time_limit_sec = data.time_limit_sec;

  return questionRepository.updateWithChoices(question, changes, data.choices);
}

async function removeQuestion(setId, questionId, user) {
  await assertCanEditSet(setId, user);

  const question = await questionRepository.findByIdAndSet(questionId, setId);
  if (!question) {
    throw notFound('QUESTION_NOT_FOUND', `No question ${questionId} found in question set ${setId}.`);
  }

  await questionRepository.deleteById(question);
}

module.exports = {
  listBySetId,
  createQuestion,
  updateQuestion,
  removeQuestion,
};
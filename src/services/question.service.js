const questionRepository = require('../repositories/question.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { appError, forbidden, notFound } = require('../errors/app-error');

// Helper to safely invoke error helper regardless of export style
function throwForbidden(msg) {
  if (forbidden) throw forbidden(msg);
  if (appError && appError.forbidden) throw appError.forbidden(msg);
  const err = new Error(msg);
  err.status = 403;
  throw err;
}

function throwNotFound(msg) {
  if (notFound) throw notFound(msg);
  if (appError && appError.notFound) throw appError.notFound(msg);
  const err = new Error(msg);
  err.status = 404;
  throw err;
}

async function listBySetId(setId, user) {
  const set = await questionSetRepository.findById(setId);
  if (!set) {
    throwNotFound('Question set not found.');
  }

  const userId = user.id || user.user_id;
  if (set.host_id !== userId && user.role !== 'ADMIN') {
    throwForbidden('You do not have permission to access these questions.');
  }

  return questionRepository.findAllBySetId(setId);
}

async function createQuestion(setId, data, user) {
  const set = await questionSetRepository.findById(setId);
  if (!set) {
    throwNotFound('Question set not found.');
  }

  const userId = user.id || user.user_id;
  if (set.host_id !== userId && user.role !== 'ADMIN') {
    throwForbidden('You do not have permission to modify this set.');
  }

  const questionData = {
    question_set_id: setId,
    position: data.position || 1,
    text: data.text,
    type: data.type || 'MULTIPLE_CHOICE',
    time_limit_sec: data.time_limit_sec || 30,
  };

  return questionRepository.createWithChoices(questionData, data.choices || []);
}

async function removeQuestion(questionId, user) {
  const question = await questionRepository.findById(questionId);
  if (!question) {
    throwNotFound('Question not found.');
  }

  const set = await questionSetRepository.findById(question.question_set_id);
  const userId = user.id || user.user_id;
  if (set && set.host_id !== userId && user.role !== 'ADMIN') {
    throwForbidden('You do not have permission to delete this question.');
  }

  return questionRepository.deleteById(questionId);
}

module.exports = {
  listBySetId,
  createQuestion,
  removeQuestion,
};
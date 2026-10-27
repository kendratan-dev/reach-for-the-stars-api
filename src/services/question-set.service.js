const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

async function findOrFail(id) {
  const questionSet = await questionSetRepository.findById(id);
  if (!questionSet) throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${id}.`);
  return questionSet;
}

function isOwner(questionSet, user) {
  return questionSet.host_id === user.user_id || user.role === 'ADMIN';
}

function list(user) {
  return user.role === 'ADMIN'
    ? questionSetRepository.findAll()
    : questionSetRepository.findAllByHost(user.user_id);
}

async function get(id, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user) && !questionSet.is_public) {
    throw forbidden('This question set belongs to another host.');
  }
  return questionSet;
}

function create(data, user) {
  return questionSetRepository.create({ ...data, host_id: user.user_id });
}

async function update(id, changes, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) throw forbidden('This question set belongs to another host.');
  return questionSetRepository.update(questionSet, changes);
}

async function remove(id, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) throw forbidden('This question set belongs to another host.');
  await questionSetRepository.remove(questionSet);
}

module.exports = { list, get, create, update, remove };
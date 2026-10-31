const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

async function findOrFail(id) {
  const questionSet = await questionSetRepository.findById(id);
  if (!questionSet) throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${id}.`);
  return questionSet;
}

function isOwner(questionSet, user) {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;

  // Compare host_id if attached to req.user, or fallback to user_id/host_id logic
  const userHostId = user.host_id || user.user_id;
  return Number(questionSet.host_id) === Number(userHostId);
}

function list(user) {
  const hostId = user.host_id || user.user_id;
  return user.role === 'ADMIN'
    ? questionSetRepository.findAll()
    : questionSetRepository.findAllByHost(hostId);
}

async function get(id, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user) && !questionSet.is_public) {
    throw forbidden('This question set belongs to another host.');
  }
  return questionSet;
}

function create(data, user) {
  const hostId = user.host_id || user.user_id;
  return questionSetRepository.create({ ...data, host_id: hostId });
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
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');

async function findOrFail(id, options = {}) {
  const questionSet = await questionSetRepository.findById(id, options);
  if (!questionSet) throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${id}.`);
  return questionSet;
}

function isOwner(questionSet, user) {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  const userHostId = user.host_id || user.user_id || user.id;
  return Number(questionSet.host_id) === Number(userHostId);
}

async function assertEditable(questionSet, user) {
  if (!isOwner(questionSet, user)) {
    throw forbidden('This question set belongs to another host.');
  }
  const inUse = await questionSetRepository.isUsedInSession(questionSet.id);
  if (inUse) {
    throw conflict('SET_IN_USE', 'This question set has already been used in a game and cannot be edited.');
  }
}

function list(user, queryParams = {}) {
  const hostId = user.role === 'ADMIN' ? null : (user.host_id || user.user_id || user.id);
  return questionSetRepository.findAndCount({
    hostId,
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    sort: queryParams.sort || 'id',
    order: queryParams.order || 'asc',
    q: queryParams.q,
  });
}

async function get(id, user, { includeQuestions = false } = {}) {
  const questionSet = await findOrFail(id, { includeQuestions });
  if (!isOwner(questionSet, user) && !questionSet.is_public) {
    throw forbidden('This question set belongs to another host.');
  }
  return questionSet;
}

function create(data, user) {
  const hostId = user.host_id || user.user_id || user.id;
  return questionSetRepository.create({ ...data, host_id: hostId });
}

async function update(id, changes, user) {
  const questionSet = await findOrFail(id);
  await assertEditable(questionSet, user);
  return questionSetRepository.update(questionSet, changes);
}

async function uploadCover(id, filename, user) {
  const questionSet = await findOrFail(id);
  await assertEditable(questionSet, user);
  const coverUrl = `/uploads/covers/${filename}`;
  return questionSetRepository.update(questionSet, { cover_url: coverUrl });
}

async function remove(id, user) {
  const questionSet = await findOrFail(id);
  await assertEditable(questionSet, user);
  await questionSetRepository.remove(questionSet);
}

module.exports = { list, get, create, update, uploadCover, remove };
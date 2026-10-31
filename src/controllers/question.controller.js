const questionService = require('../services/question.service');

async function listBySet(req, res, next) {
  try {
    const setId = parseInt(req.params.setId, 10);
    const questions = await questionService.listBySetId(setId, req.user);
    res.status(200).json({ data: questions });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const setId = parseInt(req.params.setId, 10);
    const question = await questionService.createQuestion(setId, req.body, req.user);
    res.status(201).json({ data: question });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await questionService.removeQuestion(id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listBySet,
  create,
  remove,
};
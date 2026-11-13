const { matchedData } = require('express-validator');
const questionService = require('../services/question.service');

async function listBySet(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const questions = await questionService.listBySetId(id, req.user);
  res.status(200).json({ data: questions });
}

async function create(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const data = matchedData(req, { locations: ['body'] });
  const question = await questionService.createQuestion(id, data, req.user);
  res.status(201).json(question);
}

async function update(req, res) {
  const { id, questionId } = matchedData(req, { locations: ['params'] });
  const data = matchedData(req, { locations: ['body'] });
  const question = await questionService.updateQuestion(id, questionId, data, req.user);
  res.status(200).json(question);
}

async function remove(req, res) {
  const { id, questionId } = matchedData(req, { locations: ['params'] });
  await questionService.removeQuestion(id, questionId, req.user);
  res.status(204).end();
}

module.exports = { listBySet, create, update, remove };
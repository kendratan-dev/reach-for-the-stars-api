const { matchedData } = require('express-validator');
const questionSetService = require('../services/question-set.service');

function toJson(questionSet) {
  return {
    id: questionSet.set_id,
    title: questionSet.title,
    subject: questionSet.subject,
    is_public: questionSet.is_public,
    host_id: questionSet.host_id,
    created_at: questionSet.created_at,
  };
}

async function list(req, res) {
  const questionSets = await questionSetService.list(req.user);
  res.status(200).json(questionSets.map(toJson));
}

async function get(req, res) {
  const { id } = matchedData(req);
  const questionSet = await questionSetService.get(id, req.user);
  res.status(200).json(toJson(questionSet));
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const questionSet = await questionSetService.create(data, req.user);
  res.status(201).json(toJson(questionSet));
}

async function update(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const changes = matchedData(req, { locations: ['body'] });
  const questionSet = await questionSetService.update(id, changes, req.user);
  res.status(200).json(toJson(questionSet));
}

async function remove(req, res) {
  const { id } = matchedData(req);
  await questionSetService.remove(id, req.user);
  res.status(204).end();
}

module.exports = { list, get, create, update, remove };
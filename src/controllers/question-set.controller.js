const { matchedData } = require('express-validator');
const questionSetService = require('../services/question-set.service');
const { envelope } = require('../utils/paginate');

function toJson(questionSet) {
  const json = {
    id: questionSet.id,
    title: questionSet.title,
    subject: questionSet.subject,
    description: questionSet.description,
    grade_level: questionSet.grade_level,
    cover_url: questionSet.cover_url || null,
    host_id: questionSet.host_id,
    created_at: questionSet.created_at,
  };
  if (questionSet.questions) {
    json.questions = questionSet.questions;
  }
  return json;
}

async function list(req, res) {
  const params = matchedData(req, { locations: ['query'] });
  const { rows, count } = await questionSetService.list(req.user, params);
  const page = params.page || 1;
  const limit = params.limit || 10;
  res.status(200).json(envelope(rows.map(toJson), count, { page, limit }));
}

async function get(req, res) {
  const { id, include } = matchedData(req);
  const questionSet = await questionSetService.get(id, req.user, {
    includeQuestions: include === 'questions',
  });
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

async function uploadCover(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const questionSet = await questionSetService.uploadCover(id, req.file.filename, req.user);
  res.status(200).json(toJson(questionSet));
}

async function remove(req, res) {
  const { id } = matchedData(req);
  await questionSetService.remove(id, req.user);
  res.status(204).end();
}

module.exports = { list, get, create, update, uploadCover, remove };
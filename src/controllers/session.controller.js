const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

async function create(req, res) {
  const { question_set_id } = matchedData(req, { locations: ['body'] });
  const session = await sessionService.create(question_set_id, req.user);

  res.status(201).json({
    session_id: session.id,
    code: session.join_code,
    status: session.status,
    host_id: session.host_id,
    created_at: session.created_at,
  });
}

async function get(req, res) {
  const { code } = req.params;
  const session = await sessionService.getSessionByCode(code);
  res.status(200).json({ data: session });
}

async function updateStatus(req, res) {
  const { code } = req.params;
  const { status, current_position } = matchedData(req, { locations: ['body'] });
  const session = await sessionService.patchSession(code, { status, current_position }, req.user);
  res.status(200).json({ data: session });
}

async function getQuestion(req, res) {
  const { code } = req.params;
  const question = await sessionService.getCurrentQuestion(code);
  res.status(200).json(question);
}

async function submitAnswer(req, res) {
  const { code } = req.params;
  const payload = matchedData(req, { locations: ['body'] });
  const result = await sessionService.submitAnswer(code, payload, req.user);
  res.status(201).json(result);
}

async function leaderboard(req, res) {
  const { code } = req.params;
  const { limit } = matchedData(req, { locations: ['query'] });
  const board = await sessionService.getLeaderboard(code, limit || 10);
  res.status(200).json(board);
}

module.exports = {
  create,
  get,
  getSession: get,
  updateStatus,
  changeStatus: updateStatus,
  getQuestion,
  submitAnswer,
  leaderboard,
};
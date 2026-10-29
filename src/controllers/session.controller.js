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
  const { status } = req.body;
  const session = await sessionService.changeStatus(code, status, req.user);
  res.status(200).json({ data: session });
}

module.exports = {
  create,
  get,
  getSession: get,
  updateStatus,
  changeStatus: updateStatus,
};
const sessionService = require('../services/session.service');

async function create(req, res, next) {
  try {
    const session = await sessionService.createSession(req.user, req.body);
    res.status(201).json({
      message: 'Game session created successfully',
      data: session
    });
  } catch (err) {
    next(err);
  }
}

async function join(req, res, next) {
  try {
    const result = await sessionService.joinSession(req.user, req.params.code, req.body);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const session = await sessionService.updateSessionStatus(req.user, req.params.code, req.body);
    res.status(200).json({
      message: 'Session status updated',
      data: session
    });
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    res.status(200).json({
      data: session
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  join,
  updateStatus,
  get
};
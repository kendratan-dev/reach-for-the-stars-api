const sessionService = require('../services/session.service');

async function create(req, res, next) {
  try {
    const session = await sessionService.createSession(req.body, req.user);
    res.status(201).json({ data: session });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const session = await sessionService.getSession(id);
    res.status(200).json({ data: session });
  } catch (err) {
    next(err);
  }
}

async function getByCode(req, res, next) {
  try {
    const session = await sessionService.getByCode(req.params.code);
    res.status(200).json({ data: session });
  } catch (err) {
    next(err);
  }
}

async function start(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const session = await sessionService.startSession(id, req.user);
    res.status(200).json({ data: session });
  } catch (err) {
    next(err);
  }
}

async function end(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const session = await sessionService.endSession(id, req.user);
    res.status(200).json({ data: session });
  } catch (err) {
    next(err);
  }
}

async function join(req, res, next) {
  try {
    const { join_code, nickname } = req.body;
    const result = await sessionService.joinSession(join_code, nickname, req.user);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getById,
  getByCode,
  start,
  end,
  join,
};
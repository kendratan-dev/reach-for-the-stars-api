const dbModels = require('../models');

const Session = dbModels.Session;
const QuestionSet = dbModels.QuestionSet;
const SessionPlayer = dbModels.SessionPlayer || dbModels.Player;

async function create(data) {
  return Session.create(data);
}

async function findById(id) {
  return Session.findByPk(id, {
    include: [
      { model: QuestionSet },
      { model: SessionPlayer }
    ]
  });
}

async function findByPin(pin) {
  return Session.findOne({
    where: {
      join_code: pin
    },
    include: [{ model: QuestionSet }]
  });
}

async function findAllByHost(hostId) {
  return Session.findAll({
    where: { host_id: hostId },
    include: [{ model: QuestionSet }]
  });
}

async function findExistingPlayer(sessionId, userId, nickname) {
  const { Op } = require('sequelize');

  const conditions = [];
  if (nickname) conditions.push({ nickname });
  if (userId) conditions.push({ user_id: userId });

  if (conditions.length === 0) return null;

  return SessionPlayer.findOne({
    where: {
      session_id: sessionId,
      [Op.or]: conditions
    }
  });
}

async function createPlayer(data) {
  return SessionPlayer.create(data);
}

async function update(session, changes) {
  return await session.update(changes);
}

module.exports = {
  create,
  findById,
  findByPin,
  findByCode: findByPin, // Alias for findByCode
  findAllByHost,
  findExistingPlayer,
  createPlayer,
  update,
};
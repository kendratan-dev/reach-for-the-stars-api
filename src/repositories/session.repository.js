const { Session, QuestionSet, SessionPlayer } = require('../models');

function create(data) {
  return Session.create(data);
}

function findById(id) {
  return Session.findByPk(id, {
    include: [{ model: QuestionSet }],
  });
}

function findByJoinCode(joinCode) {
  return Session.findOne({
    where: { join_code: joinCode },
    include: [{ model: QuestionSet }],
  });
}

function update(session, changes) {
  return session.update(changes);
}

function findPlayersBySessionId(sessionId) {
  return SessionPlayer.findAll({
    where: { session_id: sessionId },
    order: [['joined_at', 'ASC']],
  });
}

module.exports = {
  create,
  findById,
  findByJoinCode,
  update,
  findPlayersBySessionId,
};
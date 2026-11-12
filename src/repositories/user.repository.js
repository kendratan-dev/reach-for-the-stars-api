const { User } = require('../models');

function findBySchoolId(schoolId) {
  return User.findOne({ where: { school_id: schoolId } });
}

// The ONLY query that reads the password hash: login needs it to compare.
function findForLogin(schoolId) {
  return User.scope('withPassword').findOne({ where: { school_id: schoolId } });
}

function findById(userId) {
  return User.findByPk(userId);
}

function findAll() {
  return User.findAll({ order: [['user_id', 'ASC']] });
}

function create(data) {
  return User.create(data);
}

function update(user, changes) {
  return user.update(changes);
}

module.exports = { findBySchoolId, findForLogin, findById, findAll, create, update };

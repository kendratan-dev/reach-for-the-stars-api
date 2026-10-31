const { User } = require('../models');

function findBySchoolId(schoolId) {
  return User.findOne({ where: { school_id: schoolId } });
}

function findById(id) {
  return User.findByPk(id);
}

module.exports = { findBySchoolId, findById };
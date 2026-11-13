const { Op } = require('sequelize');
const { QuestionSet, Question, Choice, Session } = require('../models');
const { toOffset } = require('../utils/paginate');

function findAndCount({ hostId, page = 1, limit = 10, sort = 'id', order = 'asc', q }) {
  const where = {};
  if (hostId) {
    where.host_id = hostId;
  }
  if (q) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { subject: { [Op.iLike]: `%${q}%` } },
    ];
  }

  return QuestionSet.findAndCountAll({
    where,
    order: [[sort, order.toUpperCase()]],
    ...toOffset({ page, limit }),
  });
}

function findById(id, { includeQuestions = false } = {}) {
  const options = {};
  if (includeQuestions) {
    options.include = [
      {
        model: Question,
        as: 'questions',
        include: [{ model: Choice, as: 'choices' }],
      },
    ];
    options.order = [
      [{ model: Question, as: 'questions' }, 'position', 'ASC'],
      [{ model: Question, as: 'questions' }, { model: Choice, as: 'choices' }, 'choice_index', 'ASC'],
    ];
  }
  return QuestionSet.findByPk(id, options);
}

async function isUsedInSession(questionSetId) {
  const count = await Session.count({ where: { question_set_id: questionSetId } });
  return count > 0;
}

function create(data) {
  return QuestionSet.create(data);
}

function update(questionSet, changes) {
  return questionSet.update(changes);
}

function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = { findAndCount, findById, isUsedInSession, create, update, remove };
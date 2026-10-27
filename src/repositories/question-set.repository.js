const { QuestionSet, Question, Choice } = require('../models');

function findAll() {
  return QuestionSet.findAll({ order: [['set_id', 'ASC']] });
}

function findAllByHost(hostId) {
  return QuestionSet.findAll({ where: { host_id: hostId }, order: [['set_id', 'ASC']] });
}

function findById(id) {
  return QuestionSet.findByPk(id, {
    include: [
      {
        model: Question,
        as: 'questions',
        include: [
          {
            model: Choice,
            as: 'choices',
          },
        ],
      },
    ],
    order: [
      [{ model: Question, as: 'questions' }, 'position', 'ASC'],
      [{ model: Question, as: 'questions' }, { model: Choice, as: 'choices' }, 'choice_index', 'ASC'],
    ],
  });
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

module.exports = { findAll, findAllByHost, findById, create, update, remove };
const { Question, Choice, sequelize } = require('../models');

function findAllBySetId(setId) {
  return Question.findAll({
    where: { question_set_id: setId },
    include: [{ model: Choice, as: 'choices' }],
    order: [
      ['position', 'ASC'],
      [{ model: Choice, as: 'choices' }, 'choice_index', 'ASC'],
    ],
  });
}

function findById(id) {
  return Question.findByPk(id, {
    include: [{ model: Choice, as: 'choices' }],
  });
}

async function createWithChoices(questionData, choicesData) {
  return sequelize.transaction(async (t) => {
    const question = await Question.create(questionData, { transaction: t });

    if (choicesData && choicesData.length > 0) {
      const choicesToCreate = choicesData.map((choice, index) => ({
        ...choice,
        question_id: question.id,
        choice_index: choice.choice_index !== undefined ? choice.choice_index : index + 1,
      }));
      await Choice.bulkCreate(choicesToCreate, { transaction: t });
    }

    return findById(question.id);
  });
}

async function deleteById(id) {
  return Question.destroy({ where: { id } });
}

module.exports = {
  findAllBySetId,
  findById,
  createWithChoices,
  deleteById,
};
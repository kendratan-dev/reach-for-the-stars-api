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

function findByIdAndSet(questionId, setId, transaction) {
  return Question.findOne({
    where: { id: questionId, question_set_id: setId },
    include: [{ model: Choice, as: 'choices' }],
    order: [[{ model: Choice, as: 'choices' }, 'choice_index', 'ASC']],
    transaction,
  });
}

async function createWithChoices(setId, questionData, choicesData) {
  return sequelize.transaction(async (t) => {
    const maxPosition = await Question.max('position', {
      where: { question_set_id: setId },
      transaction: t,
    });
    const nextPosition = (Number.isFinite(maxPosition) ? maxPosition : 0) + 1;

    const question = await Question.create(
      {
        ...questionData,
        question_set_id: setId,
        position: nextPosition,
      },
      { transaction: t }
    );

    const choicesToCreate = choicesData.map((choice, index) => ({
      question_id: question.id,
      choice_index: index + 1,
      text: choice.text.trim(),
      is_correct: choice.is_correct,
    }));
    await Choice.bulkCreate(choicesToCreate, { transaction: t });

    return findByIdAndSet(question.id, setId, t);
  });
}

async function updateWithChoices(question, changes, choicesData) {
  return sequelize.transaction(async (t) => {
    await question.update(changes, { transaction: t });

    if (choicesData) {
      await Choice.destroy({ where: { question_id: question.id }, transaction: t });
      const choicesToCreate = choicesData.map((choice, index) => ({
        question_id: question.id,
        choice_index: index + 1,
        text: choice.text.trim(),
        is_correct: choice.is_correct,
      }));
      await Choice.bulkCreate(choicesToCreate, { transaction: t });
    }

    return findByIdAndSet(question.id, question.question_set_id, t);
  });
}

async function deleteById(question) {
  return sequelize.transaction(async (t) => {
    await Choice.destroy({ where: { question_id: question.id }, transaction: t });
    await question.destroy({ transaction: t });
  });
}

module.exports = {
  findAllBySetId,
  findByIdAndSet,
  createWithChoices,
  updateWithChoices,
  deleteById,
};
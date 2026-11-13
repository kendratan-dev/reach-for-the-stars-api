const { Router } = require('express');
const controller = require('../controllers/question.controller');
const rules = require('../validators/question.validator');
const validate = require('../middlewares/validate');

const router = Router({ mergeParams: true });

// Mounted at /api/v1/question-sets/:id/questions
router.get('/', rules.setIdParam, validate, controller.listBySet);
router.post('/', rules.createQuestionRules, validate, controller.create);
router.patch('/:questionId', rules.updateQuestionRules, validate, controller.update);
router.delete('/:questionId', rules.setIdParam, rules.questionIdParam, validate, controller.remove);

module.exports = router;
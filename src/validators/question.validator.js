const { body, param } = require('express-validator');

const setIdParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

const questionIdParam = param('questionId')
  .isInt({ min: 1 }).withMessage('questionId must be a positive whole number')
  .toInt();

const choicesRule = (optional = false) => {
  let chain = body('choices');
  chain = optional ? chain.optional() : chain.exists().withMessage('choices are required').bail();
  return chain
    .isArray({ min: 2, max: 6 }).withMessage('choices must be an array of 2 to 6 items')
    .bail()
    .custom((choices) => {
      for (const c of choices) {
        if (!c || typeof c.text !== 'string' || !c.text.trim()) {
          throw new Error('every choice must have non-empty text');
        }
        if (typeof c.is_correct !== 'boolean') {
          throw new Error('every choice must have boolean is_correct');
        }
      }
      const correctCount = choices.filter((c) => c.is_correct === true).length;
      if (correctCount !== 1) {
        throw new Error('a question must have exactly one correct choice');
      }
      return true;
    });
};

const createQuestionRules = [
  setIdParam,
  body('text')
    .exists().withMessage('text is required').bail()
    .isString().trim().isLength({ min: 1, max: 500 }).withMessage('text must be 1 to 500 characters'),
  body('type')
    .optional()
    .isIn(['MULTIPLE_CHOICE', 'TRUE_FALSE']).withMessage('type must be MULTIPLE_CHOICE or TRUE_FALSE'),
  body('time_limit_sec')
    .optional()
    .isInt({ min: 5, max: 120 }).withMessage('time_limit_sec must be 5 to 120').toInt(),
  choicesRule(false),
];

const updateQuestionRules = [
  setIdParam,
  questionIdParam,
  body('text')
    .optional()
    .isString().trim().isLength({ min: 1, max: 500 }).withMessage('text must be 1 to 500 characters'),
  body('type')
    .optional()
    .isIn(['MULTIPLE_CHOICE', 'TRUE_FALSE']).withMessage('type must be MULTIPLE_CHOICE or TRUE_FALSE'),
  body('time_limit_sec')
    .optional()
    .isInt({ min: 5, max: 120 }).withMessage('time_limit_sec must be 5 to 120').toInt(),
  choicesRule(true),
];

module.exports = { setIdParam, questionIdParam, createQuestionRules, updateQuestionRules };
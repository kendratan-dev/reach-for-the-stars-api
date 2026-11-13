const { body, param, query } = require('express-validator');

const codeParam = param('code')
  .matches(/^[1-9][0-9]{5}$/).withMessage('the join code must be six digits');

const createRules = [
  body('question_set_id')
    .exists().withMessage('question_set_id is required')
    .bail()
    .isInt({ min: 1 }).withMessage('question_set_id must be a positive integer')
    .toInt(),
];

const patchSessionRules = [
  codeParam,
  body('status')
    .optional()
    .isIn(['RUNNING', 'CLOSED']).withMessage('status must be RUNNING or CLOSED'),
  body('current_position')
    .optional()
    .isInt({ min: 1 }).withMessage('current_position must be a positive integer')
    .toInt(),
  body().custom((value) => {
    if (value.status === undefined && value.current_position === undefined) {
      throw new Error('Provide status or current_position');
    }
    return true;
  }),
];

const joinRules = [
  codeParam,
  body('nickname')
    .exists().withMessage('nickname is required')
    .bail()
    .isString().withMessage('nickname must be text')
    .bail()
    .trim()
    .isLength({ min: 2, max: 24 }).withMessage('nickname must be 2 to 24 characters long'),
];

const answerRules = [
  codeParam,
  body('question_id')
    .exists().withMessage('question_id is required')
    .bail()
    .isInt({ min: 1 }).withMessage('question_id must be a positive integer')
    .toInt(),
  body('choice_id')
    .exists().withMessage('choice_id is required')
    .bail()
    .isInt({ min: 1 }).withMessage('choice_id must be a positive integer')
    .toInt(),
];

const leaderboardRules = [
  codeParam,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
    .toInt(),
];

module.exports = {
  codeParam,
  createRules,
  statusRules: patchSessionRules,
  patchSessionRules,
  joinRules,
  answerRules,
  leaderboardRules,
};
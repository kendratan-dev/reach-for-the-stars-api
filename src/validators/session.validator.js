const { body, param } = require('express-validator');

const createRules = [
  body('question_set_id')
    .notEmpty().withMessage('question_set_id is required.')
    .isInt({ min: 1 }).withMessage('question_set_id must be a valid positive integer.')
];

const joinRules = [
  body('nickname')
    .notEmpty().withMessage('Nickname is required.')
    .isString().withMessage('Nickname must be a string.')
    .isLength({ min: 2, max: 20 }).withMessage('Nickname must be between 2 and 20 characters.')
    .trim()
];

const idParam = [
  param('id')
    .isInt({ min: 1 }).withMessage('Session ID must be a positive integer.')
];

module.exports = {
  createRules,
  joinRules,
  idParam
};
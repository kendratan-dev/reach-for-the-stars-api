const { body, param } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

const title = () => body('title')
  .exists().withMessage('title is required')
  .bail()
  .isString().withMessage('title must be text')
  .bail()
  .trim()
  .isLength({ min: 3, max: 150 }).withMessage('title must be 3 to 150 characters long');

const subject = () => body('subject')
  .optional({ values: 'null' })
  .isString().withMessage('subject must be text')
  .bail()
  .trim()
  .isLength({ max: 60 }).withMessage('subject must be at most 60 characters long');

const isPublic = () => body('is_public')
  .optional()
  .isBoolean({ strict: true }).withMessage('is_public must be true or false');

const createRules = [title(), subject(), isPublic()];

const updateRules = [
  idParam,
  title().optional(),
  subject(),
  isPublic(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    if (!sent.some((key) => ['title', 'subject', 'is_public'].includes(key))) {
      throw new Error('send at least one of: title, subject, is_public');
    }
    return true;
  }),
];

module.exports = { idParam, createRules, updateRules };
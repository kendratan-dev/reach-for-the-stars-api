const { body, param, query } = require('express-validator');
const { pageRules, sortRules } = require('./list.validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

const listRules = [
  ...pageRules,
  ...sortRules(['id', 'title', 'subject', 'created_at']),
  query('q').optional().isString().trim().isLength({ max: 100 }).withMessage('q must be at most 100 characters'),
];

const getOneRules = [
  idParam,
  query('include').optional().isIn(['questions']).withMessage('include must be questions'),
];

const title = () => body('title')
  .exists().withMessage('title is required')
  .bail()
  .isString().withMessage('title must be text')
  .bail()
  .trim()
  .isLength({ min: 3, max: 150 }).withMessage('title must be 3 to 150 characters long');

const description = () => body('description')
  .optional({ values: 'null' })
  .isString().withMessage('description must be text')
  .bail()
  .trim();

const subject = () => body('subject')
  .optional({ values: 'null' })
  .isString().withMessage('subject must be text')
  .bail()
  .trim()
  .isLength({ max: 60 }).withMessage('subject must be at most 60 characters long');

const gradeLevel = () => body('grade_level')
  .optional({ values: 'null' })
  .isString().withMessage('grade_level must be text')
  .bail()
  .trim()
  .isLength({ max: 50 }).withMessage('grade_level must be at most 50 characters long');

const isPublic = () => body('is_public')
  .optional()
  .isBoolean({ strict: true }).withMessage('is_public must be true or false');

const createRules = [title(), description(), subject(), gradeLevel(), isPublic()];

const updateRules = [
  idParam,
  title().optional(),
  description(),
  subject(),
  gradeLevel(),
  isPublic(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    if (!sent.some((key) => ['title', 'description', 'subject', 'grade_level', 'is_public'].includes(key))) {
      throw new Error('send at least one of: title, description, subject, grade_level, is_public');
    }
    return true;
  }),
];

module.exports = { idParam, listRules, getOneRules, createRules, updateRules };
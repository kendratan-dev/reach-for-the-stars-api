const { body } = require('express-validator');

const registerRules = [
  body('school_id').exists().withMessage('school_id is required').bail().isString().trim(),
  body('full_name').exists().withMessage('full_name is required').bail().isString().trim(),
  body('email').exists().withMessage('email is required').bail().isEmail().normalizeEmail(),
  body('password')
    .exists().withMessage('password is required').bail()
    .isString()
    .isLength({ min: 8, max: 72 })
    .withMessage('password must be 8 to 72 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('password must contain at least one letter and one number'),
];

const loginRules = [
  body('school_id').exists().withMessage('school_id is required').bail().isString().trim(),
  body('password').exists().withMessage('password is required').bail().isString(),
];

module.exports = {
  registerRules,
  loginRules,
};
// Shared rules for ?page and ?limit on every list endpoint.
const { query } = require('express-validator');

const pageRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a whole number from 1').toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be 1 to 50').toInt(),
];

// sort may only name a column on this list, so nobody can sort by password_hash
// or inject SQL through the URL.
function sortRules(columns) {
  return [
    query('sort').optional().isIn(columns).withMessage(`sort must be one of: ${columns.join(', ')}`),
    query('order').optional().isIn(['asc', 'desc']).withMessage('order must be asc or desc'),
  ];
}

module.exports = { pageRules, sortRules };

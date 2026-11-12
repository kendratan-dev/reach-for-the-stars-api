// Offset pagination: ?page=2&limit=10 -> skip 10 rows, take 10.
// Every list endpoint answers in the same envelope:
//   { "data": [...], "meta": { "page": 2, "limit": 10, "total": 23, "pages": 3 } }
function toOffset({ page = 1, limit = 10 }) {
  return { limit, offset: (page - 1) * limit };
}

function envelope(rows, total, { page = 1, limit = 10 }) {
  return { data: rows, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

module.exports = { toOffset, envelope };

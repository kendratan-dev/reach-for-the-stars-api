// Runs when no route matched the request.
function notFound(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `No route for ${req.method} ${req.originalUrl}`,
    },
  });
}

module.exports = notFound;

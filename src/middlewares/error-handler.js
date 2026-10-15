// Last stop for any error thrown in a route. Four arguments = error handler.
// The client gets clean JSON; the stack trace stays in the server log.
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const isServerFault = status >= 500;

  res.status(status).json({
    error: {
      code: isServerFault ? 'INTERNAL_ERROR' : err.code || 'BAD_REQUEST',
      message: isServerFault ? 'Something went wrong on the server.' : err.message,
    },
  });
}

module.exports = errorHandler;

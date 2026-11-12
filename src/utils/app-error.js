class AppError extends Error {
  constructor(message, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Helper functions for common errors
function conflict(code, message) {
  return new AppError(message, 409, code);
}

function notFound(code, message) {
  return new AppError(message, 404, code);
}

AppError.conflict = conflict;
AppError.notFound = notFound;

module.exports = AppError;
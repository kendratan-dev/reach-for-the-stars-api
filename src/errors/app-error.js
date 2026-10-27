// An error the client is allowed to see. It carries the HTTP status, a code
// for programs to check and a message for people to read.
// Services throw these. The error handler turns them into the shared error JSON.
class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    if (details) this.details = details;
  }
}

const badRequest = (code, message, details) => new AppError(400, code, message, details);
const unauthorized = (message = 'Say who you are first: send the X-Demo-User header.') => new AppError(401, 'AUTH_REQUIRED', message);
const forbidden = (message = 'You are not allowed to do that.') => new AppError(403, 'FORBIDDEN', message);
const notFound = (code, message) => new AppError(404, code, message);
const conflict = (code, message) => new AppError(409, code, message);

module.exports = { AppError, badRequest, unauthorized, forbidden, notFound, conflict };

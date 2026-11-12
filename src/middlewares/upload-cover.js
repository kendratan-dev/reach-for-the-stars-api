// Week 13 kit: receives ONE picture in a multipart form field. Rename the field, the folder and the
// URL to fit YOUR game (a cover, an avatar, a card image ...). The three rules stay the same.
// The rules a validator cannot check, because the file is not JSON:
//   only PNG or JPEG, at most 1 MB, and a file name WE choose (never the client's).
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { badRequest, AppError } = require('../errors/app-error');

const TYPES = { 'image/png': '.png', 'image/jpeg': '.jpg' };

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads', 'covers'),
  filename: (req, file, cb) => cb(null, `set-${req.params.id}-${crypto.randomUUID()}${TYPES[file.mimetype]}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (TYPES[file.mimetype]) return cb(null, true);
    return cb(badRequest('INVALID_FILE_TYPE', 'cover must be a PNG or JPEG picture'));
  },
}).single('cover');

// multer reports problems through a callback; we turn them into our own errors.
function uploadCover(req, res, next) {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') return next(new AppError(413, 'FILE_TOO_LARGE', 'cover must be at most 1 MB'));
      return next(badRequest('INVALID_UPLOAD', 'send one picture in the form field "cover"'));
    }
    if (error) return next(error);          // our own INVALID_FILE_TYPE, or a disk problem
    if (!req.file) return next(badRequest('COVER_REQUIRED', 'send one picture in the form field "cover"'));
    return next();
  });
}

module.exports = uploadCover;

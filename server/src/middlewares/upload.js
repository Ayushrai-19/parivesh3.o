const fs = require('fs');
const path = require('path');
const multer = require('multer');

const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const appId = req.params.applicationId || req.body.applicationId;
    const folder = path.join(__dirname, '../../uploads', String(appId || 'temp'));
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${sanitized}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const validExt = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'].includes(ext);
  const validMime = ALLOWED_MIME.includes(file.mimetype);

  if (!validExt || !validMime) {
    const err = new Error('Only PDF, DOC, DOCX, PNG, and JPG files are allowed');
    err.status = 400;
    return cb(err);
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = upload;

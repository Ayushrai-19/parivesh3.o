const express = require('express');
const fs = require('fs');
const path = require('path');
const { param } = require('express-validator');

const pool = require('../config/db');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/upload');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');
const { sendResponse, asyncHandler } = require('../utils/response');

const router = express.Router();

router.use(authenticate);

router.get(
  '/application/:applicationId',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const appRes = await pool.query('SELECT id, proponent_id FROM applications WHERE id = $1', [req.params.applicationId]);
    if (!appRes.rowCount) return sendResponse(res, 404, false, null, 'Application not found');

    if (req.user.role === ROLES.PROPONENT && appRes.rows[0].proponent_id !== req.user.id) {
      return sendResponse(res, 403, false, null, 'Forbidden');
    }

    const docs = await pool.query(
      `SELECT id, application_id, file_name, file_type, uploaded_at
       FROM documents
       WHERE application_id = $1
       ORDER BY uploaded_at DESC`,
      [req.params.applicationId]
    );

    return sendResponse(res, 200, true, docs.rows, 'Documents fetched');
  })
);

router.post(
  '/:applicationId/upload',
  authorize(ROLES.PROPONENT),
  [param('applicationId').isInt()],
  validateRequest,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return sendResponse(res, 400, false, null, 'No file uploaded');
    }

    const appRes = await pool.query('SELECT id, proponent_id FROM applications WHERE id = $1', [req.params.applicationId]);
    if (!appRes.rowCount) {
      return sendResponse(res, 404, false, null, 'Application not found');
    }
    if (appRes.rows[0].proponent_id !== req.user.id) {
      return sendResponse(res, 403, false, null, 'Forbidden');
    }

    const inserted = await pool.query(
      `INSERT INTO documents (application_id, file_name, file_path, file_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, application_id, file_name, file_type, uploaded_at`,
      [req.params.applicationId, req.file.originalname, req.file.path, req.file.mimetype]
    );

    return sendResponse(res, 201, true, inserted.rows[0], 'Document uploaded');
  })
);

router.get(
  '/:id/download',
  [param('id').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const docRes = await pool.query(
      `SELECT d.id, d.file_name, d.file_path, d.file_type, a.proponent_id
       FROM documents d
       JOIN applications a ON a.id = d.application_id
       WHERE d.id = $1`,
      [req.params.id]
    );
    if (!docRes.rowCount) {
      return sendResponse(res, 404, false, null, 'Document not found');
    }

    const doc = docRes.rows[0];
    if (req.user.role === ROLES.PROPONENT && req.user.id !== doc.proponent_id) {
      return sendResponse(res, 403, false, null, 'Forbidden');
    }

    if (!fs.existsSync(doc.file_path)) {
      return sendResponse(res, 404, false, null, 'Stored file missing');
    }

    const ext = path.extname(doc.file_name).toLowerCase();
    res.setHeader('Content-Type', doc.file_type);
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(doc.file_name, ext)}${ext}"`);
    return fs.createReadStream(doc.file_path).pipe(res);
  })
);

module.exports = router;

const express = require('express');
const { body, param } = require('express-validator');

const pool = require('../config/db');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES, APP_STATUS } = require('../utils/constants');
const { sendResponse, asyncHandler } = require('../utils/response');
const { transitionApplicationStatus } = require('../services/workflowService');
const { createNotification } = require('../services/notificationService');
const { aiRegenerateGist } = require('../services/gistService');
const { generateMomWithAI } = require('../services/aiService');

const router = express.Router();

// ── Document viewer: any authenticated user; proponent = own app only ──
router.get(
  '/:applicationId/document',
  authenticate,
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const appId = Number(req.params.applicationId);

    const appRes = await pool.query(
      `SELECT a.id, a.proponent_id, a.project_name, a.sector, a.category, a.location, a.created_at,
              u.name AS proponent_name
       FROM applications a
       JOIN users u ON u.id = a.proponent_id
       WHERE a.id = $1`,
      [appId]
    );
    if (!appRes.rowCount) return sendResponse(res, 404, false, null, 'Application not found');

    const app = appRes.rows[0];

    // Proponents may only view their own application's MoM
    if (req.user.role === ROLES.PROPONENT && app.proponent_id !== req.user.id) {
      return sendResponse(res, 403, false, null, 'Access denied');
    }

    const momRes = await pool.query(
      `SELECT m.id, m.content, m.is_locked, m.finalized_at,
              u.name AS finalized_by_name
       FROM mom m
       LEFT JOIN users u ON u.id = m.finalized_by
       WHERE m.application_id = $1`,
      [appId]
    );
    if (!momRes.rowCount) return sendResponse(res, 404, false, null, 'MoM document not yet generated for this application');

    const mom = momRes.rows[0];
    const year = new Date(app.created_at || Date.now()).getFullYear();

    return sendResponse(res, 200, true, {
      mom_id: `MOM/EAC/${appId}/${year}`,
      application_id: appId,
      project_name: app.project_name,
      sector: app.sector,
      category: app.category,
      location: app.location,
      proponent_name: app.proponent_name,
      content: mom.content,
      is_locked: mom.is_locked,
      finalized_at: mom.finalized_at,
      finalized_by_name: mom.finalized_by_name,
    }, 'MoM document fetched');
  })
);

// ── All remaining MoM management routes require MOM or ADMIN role ──
router.use(authenticate, authorize(ROLES.MOM, ROLES.ADMIN));

router.get(
  '/queue',
  asyncHandler(async (req, res) => {
    const rows = await pool.query(
      `SELECT a.*, g.generated_at
       FROM applications a
       JOIN gists g ON g.application_id = a.id
       WHERE a.status = $1
       ORDER BY a.updated_at ASC`,
      [APP_STATUS.MOM_GENERATED]
    );
    return sendResponse(res, 200, true, rows.rows, 'MoM queue fetched');
  })
);

router.get(
  '/:applicationId/gist',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const gist = await pool.query('SELECT * FROM gists WHERE application_id = $1', [req.params.applicationId]);
    if (!gist.rowCount) return sendResponse(res, 404, false, null, 'Gist not found');
    return sendResponse(res, 200, true, gist.rows[0], 'Gist fetched');
  })
);

router.put(
  '/:applicationId/gist',
  [param('applicationId').isInt(), body('edited_content').notEmpty()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const appRes = await pool.query('SELECT status FROM applications WHERE id = $1', [req.params.applicationId]);
    if (!appRes.rowCount) return sendResponse(res, 404, false, null, 'Application not found');

    const momRes = await pool.query('SELECT is_locked FROM mom WHERE application_id = $1', [req.params.applicationId]);
    if (momRes.rowCount && momRes.rows[0].is_locked) {
      return sendResponse(res, 423, false, null, 'MoM is locked and immutable');
    }

    const result = await pool.query(
      `UPDATE gists
       SET edited_content = $1, edited_by = $2
       WHERE application_id = $3
       RETURNING *`,
      [req.body.edited_content, req.user.id, req.params.applicationId]
    );

    if (!result.rowCount) {
      return sendResponse(res, 404, false, null, 'Gist not found');
    }

    return sendResponse(res, 200, true, result.rows[0], 'Gist updated');
  })
);

// ── Update MoM document content (MoM team can edit AI-generated draft) ──
router.put(
  '/:applicationId/content',
  [param('applicationId').isInt(), body('content').notEmpty()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const appId = Number(req.params.applicationId);

    const momRes = await pool.query(
      'SELECT id, is_locked FROM mom WHERE application_id = $1',
      [appId]
    );
    if (!momRes.rowCount) return sendResponse(res, 404, false, null, 'MoM not found — generate it first');
    if (momRes.rows[0].is_locked) return sendResponse(res, 423, false, null, 'MoM is locked and immutable');

    const result = await pool.query(
      'UPDATE mom SET content = $1 WHERE application_id = $2 RETURNING *',
      [req.body.content, appId]
    );

    return sendResponse(res, 200, true, result.rows[0], 'MoM content updated');
  })
);

router.post(
  '/:applicationId/gist/ai-regenerate',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
      return sendResponse(res, 503, false, null, 'AI service is not configured — set GEMINI_API_KEY in .env');
    }

    const lockRes = await pool.query('SELECT is_locked FROM mom WHERE application_id = $1', [req.params.applicationId]);
    if (lockRes.rowCount && lockRes.rows[0].is_locked) {
      return sendResponse(res, 423, false, null, 'MoM is locked and immutable');
    }

    const updated = await aiRegenerateGist({
      applicationId: Number(req.params.applicationId),
      changedBy: req.user.id,
    });

    return sendResponse(res, 200, true, updated, 'Gist regenerated with AI');
  })
);

router.post(
  '/:applicationId/ai-generate-mom',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
      return sendResponse(res, 503, false, null, 'AI service is not configured — set GEMINI_API_KEY in .env');
    }

    const appId = Number(req.params.applicationId);

    const lockRes = await pool.query('SELECT is_locked FROM mom WHERE application_id = $1', [appId]);
    if (lockRes.rowCount && lockRes.rows[0].is_locked) {
      return sendResponse(res, 423, false, null, 'MoM is locked and immutable');
    }

    const appRes = await pool.query(
      `SELECT a.id, a.project_name, a.sector, a.category, a.location, a.description, a.impact_summary,
              u.name AS proponent_name
       FROM applications a
       JOIN users u ON u.id = a.proponent_id
       WHERE a.id = $1`,
      [appId]
    );
    if (!appRes.rowCount) return sendResponse(res, 404, false, null, 'Application not found');

    const gistRes = await pool.query('SELECT id, content, edited_content FROM gists WHERE application_id = $1', [appId]);
    if (!gistRes.rowCount) return sendResponse(res, 404, false, null, 'Gist not found — application must be referred first');

    const gist = gistRes.rows[0];
    const aiContent = await generateMomWithAI(appRes.rows[0], gist.edited_content || gist.content);

    const momRes = await pool.query(
      `INSERT INTO mom (application_id, gist_id, content, finalized_by, finalized_at, is_locked)
       VALUES ($1, $2, $3, NULL, NULL, false)
       ON CONFLICT (application_id)
       DO UPDATE SET content = EXCLUDED.content, gist_id = EXCLUDED.gist_id
       RETURNING *`,
      [appId, gist.id, aiContent]
    );

    return sendResponse(res, 200, true, momRes.rows[0], 'Full MoM generated with AI');
  })
);

router.post(
  '/:applicationId/convert',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const appId = Number(req.params.applicationId);

    const lockRes = await pool.query('SELECT is_locked FROM mom WHERE application_id = $1', [appId]);
    if (lockRes.rowCount && lockRes.rows[0].is_locked) {
      return sendResponse(res, 423, false, null, 'MoM is locked and immutable');
    }

    const gistRes = await pool.query('SELECT id, content, edited_content FROM gists WHERE application_id = $1', [appId]);
    if (!gistRes.rowCount) {
      return sendResponse(res, 404, false, null, 'Gist not found');
    }

    const gist = gistRes.rows[0];
    const content = gist.edited_content || gist.content;

    const momRes = await pool.query(
      `INSERT INTO mom (application_id, gist_id, content, finalized_by, finalized_at, is_locked)
       VALUES ($1, $2, $3, NULL, NULL, false)
       ON CONFLICT (application_id)
       DO UPDATE SET content = EXCLUDED.content, gist_id = EXCLUDED.gist_id
       RETURNING *`,
      [appId, gist.id, content]
    );

    return sendResponse(res, 200, true, momRes.rows[0], 'Converted gist to MoM draft');
  })
);

router.post(
  '/:applicationId/finalize',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const appId = Number(req.params.applicationId);

    const appRes = await pool.query('SELECT status, proponent_id FROM applications WHERE id = $1', [appId]);
    if (!appRes.rowCount) return sendResponse(res, 404, false, null, 'Application not found');

    const lockRes = await pool.query('SELECT id, is_locked FROM mom WHERE application_id = $1', [appId]);
    if (!lockRes.rowCount) {
      return sendResponse(res, 400, false, null, 'Convert to MoM before finalization');
    }
    if (lockRes.rows[0].is_locked) {
      return sendResponse(res, 423, false, null, 'MoM is already locked');
    }

    await pool.query(
      `UPDATE mom
       SET finalized_by = $1,
           finalized_at = NOW(),
           is_locked = true
       WHERE application_id = $2`,
      [req.user.id, appId]
    );

    await transitionApplicationStatus({
      applicationId: appId,
      changedBy: req.user.id,
      newStatus: APP_STATUS.FINALIZED,
      notes: 'MoM finalized and locked',
    });

    await createNotification(
      appRes.rows[0].proponent_id,
      `Application #${appId} finalized. PDF and DOCX downloads are now available.`,
      {
        subject: `Application #${appId} Finalized`,
        title: 'Application Finalized',
        details: [
          { label: 'Application ID', value: `#${appId}` },
          { label: 'Final Status', value: APP_STATUS.FINALIZED },
          { label: 'Downloads', value: 'PDF and DOCX are now available' },
        ],
      }
    );

    return sendResponse(res, 200, true, null, 'MoM finalized and locked');
  })
);

module.exports = router;

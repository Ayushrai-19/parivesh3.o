const express = require('express');
const { body, param } = require('express-validator');

const pool = require('../config/db');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES, APP_STATUS } = require('../utils/constants');
const { sendResponse, asyncHandler } = require('../utils/response');
const { transitionApplicationStatus } = require('../services/workflowService');
const { autoGenerateGistAndPromote } = require('../services/gistService');
const { createNotification } = require('../services/notificationService');

const router = express.Router();

router.use(authenticate, authorize(ROLES.SCRUTINY, ROLES.ADMIN));

router.get(
  '/queue',
  asyncHandler(async (req, res) => {
    const queue = await pool.query(
      `SELECT a.*, u.name AS proponent_name
       FROM applications a
       JOIN users u ON u.id = a.proponent_id
       WHERE a.status IN ($1, $2)
       ORDER BY a.updated_at ASC`,
      [APP_STATUS.SUBMITTED, APP_STATUS.UNDER_SCRUTINY]
    );
    return sendResponse(res, 200, true, queue.rows, 'Scrutiny queue fetched');
  })
);

router.post(
  '/:applicationId/start',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    await transitionApplicationStatus({
      applicationId: Number(req.params.applicationId),
      changedBy: req.user.id,
      newStatus: APP_STATUS.UNDER_SCRUTINY,
      notes: 'Scrutiny started',
    });

    return sendResponse(res, 200, true, null, 'Application moved to UNDER_SCRUTINY');
  })
);

router.post(
  '/:applicationId/raise-eds',
  [param('applicationId').isInt(), body('reason').trim().notEmpty().withMessage('Reason is required')],
  validateRequest,
  asyncHandler(async (req, res) => {
    const applicationId = Number(req.params.applicationId);
    const { reason } = req.body;

    const appRes = await pool.query('SELECT id, proponent_id FROM applications WHERE id = $1', [applicationId]);
    if (!appRes.rowCount) {
      return sendResponse(res, 404, false, null, 'Application not found');
    }

    await pool.query(
      `INSERT INTO eds_flags (application_id, raised_by, reason)
       VALUES ($1, $2, $3)`,
      [applicationId, req.user.id, reason]
    );

    await transitionApplicationStatus({
      applicationId,
      changedBy: req.user.id,
      newStatus: APP_STATUS.ESSENTIAL_DOC_SOUGHT,
      notes: reason,
    });

    await createNotification(appRes.rows[0].proponent_id, `EDS raised for Application #${applicationId}: ${reason}`, {
      subject: `EDS Raised: Application #${applicationId}`,
      title: 'Essential Documents Sought',
      details: [
        { label: 'Application ID', value: `#${applicationId}` },
        { label: 'Status', value: APP_STATUS.ESSENTIAL_DOC_SOUGHT },
      ],
      note: reason,
    });

    return sendResponse(res, 200, true, null, 'EDS raised successfully');
  })
);

router.post(
  '/:applicationId/refer',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const applicationId = Number(req.params.applicationId);
    await transitionApplicationStatus({
      applicationId,
      changedBy: req.user.id,
      newStatus: APP_STATUS.REFERRED,
      notes: 'Referred for MoM generation',
    });

    await autoGenerateGistAndPromote({ applicationId, changedBy: req.user.id });

    const scrutinyUsers = await pool.query("SELECT id FROM users WHERE role = 'SCRUTINY'");
    await Promise.all(
      scrutinyUsers.rows.map((u) =>
        createNotification(u.id, `Application #${applicationId} referred and gist auto-generated.`, {
          subject: `Application #${applicationId} Referred`,
          title: 'Referred To MoM',
          details: [
            { label: 'Application ID', value: `#${applicationId}` },
            { label: 'Current Status', value: APP_STATUS.MOM_GENERATED },
          ],
        })
      )
    );

    return sendResponse(res, 200, true, null, 'Referred and MoM gist generated');
  })
);

module.exports = router;

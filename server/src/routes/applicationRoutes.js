const express = require('express');
const { body, param } = require('express-validator');

const pool = require('../config/db');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { sendResponse, asyncHandler } = require('../utils/response');
const { APP_STATUS, ROLES } = require('../utils/constants');
const { transitionApplicationStatus } = require('../services/workflowService');
const { createNotification } = require('../services/notificationService');

const router = express.Router();

const getApplicationById = async (id) => {
  const result = await pool.query(
    `SELECT a.*, u.name AS proponent_name
     FROM applications a
     JOIN users u ON u.id = a.proponent_id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    if (req.user.role === ROLES.PROPONENT) {
      const [rows, count] = await Promise.all([
        pool.query(
          `SELECT a.*, ef.reason AS latest_eds_reason
           FROM applications a
           LEFT JOIN (
             SELECT e.application_id, e.reason
             FROM eds_flags e
             INNER JOIN (
               SELECT application_id, MAX(id) AS latest_id
               FROM eds_flags
               GROUP BY application_id
             ) latest ON latest.latest_id = e.id
           ) ef ON ef.application_id = a.id
           WHERE a.proponent_id = $1
           ORDER BY a.updated_at DESC
           LIMIT $2 OFFSET $3`,
          [req.user.id, limit, offset]
        ),
        pool.query('SELECT COUNT(*)::int AS total FROM applications WHERE proponent_id = $1', [req.user.id]),
      ]);

      return sendResponse(
        res,
        200,
        true,
        {
          items: rows.rows,
          pagination: { page, limit, total: count.rows[0].total },
        },
        'Applications fetched'
      );
    }

    const [rows, count] = await Promise.all([
      pool.query('SELECT * FROM applications ORDER BY updated_at DESC LIMIT $1 OFFSET $2', [limit, offset]),
      pool.query('SELECT COUNT(*)::int AS total FROM applications'),
    ]);

    return sendResponse(
      res,
      200,
      true,
      {
        items: rows.rows,
        pagination: { page, limit, total: count.rows[0].total },
      },
      'Applications fetched'
    );
  })
);

router.get(
  '/:id',
  [param('id').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const app = await getApplicationById(req.params.id);
    if (!app) {
      return sendResponse(res, 404, false, null, 'Application not found');
    }
    if (req.user.role === ROLES.PROPONENT && app.proponent_id !== req.user.id) {
      return sendResponse(res, 403, false, null, 'Forbidden');
    }
    return sendResponse(res, 200, true, app, 'Application fetched');
  })
);

router.get(
  '/:id/timeline',
  [param('id').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const app = await getApplicationById(req.params.id);
    if (!app) {
      return sendResponse(res, 404, false, null, 'Application not found');
    }
    if (req.user.role === ROLES.PROPONENT && app.proponent_id !== req.user.id) {
      return sendResponse(res, 403, false, null, 'Forbidden');
    }

    const [auditRows, edsRows] = await Promise.all([
      pool.query(
        `SELECT al.id,
                al.old_status,
                al.new_status,
                al.notes,
                al.timestamp,
                u.name AS changed_by_name,
                u.role AS changed_by_role
         FROM audit_log al
         JOIN users u ON u.id = al.changed_by
         WHERE al.application_id = $1
         ORDER BY al.timestamp DESC`,
        [req.params.id]
      ),
      pool.query(
        `SELECT ef.id,
                ef.reason,
                ef.created_at,
                ef.resolved_at,
                u.name AS raised_by_name,
                u.role AS raised_by_role
         FROM eds_flags ef
         JOIN users u ON u.id = ef.raised_by
         WHERE ef.application_id = $1
         ORDER BY ef.created_at DESC`,
        [req.params.id]
      ),
    ]);

    return sendResponse(
      res,
      200,
      true,
      {
        audit: auditRows.rows,
        eds: edsRows.rows,
      },
      'Application timeline fetched'
    );
  })
);

router.get(
  '/:id/gist',
  [param('id').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const app = await getApplicationById(req.params.id);
    if (!app) {
      return sendResponse(res, 404, false, null, 'Application not found');
    }

    if (req.user.role === ROLES.PROPONENT && app.proponent_id !== req.user.id) {
      return sendResponse(res, 403, false, null, 'Forbidden');
    }

    const gistRes = await pool.query('SELECT * FROM gists WHERE application_id = $1', [req.params.id]);
    if (!gistRes.rowCount) {
      return sendResponse(res, 404, false, null, 'Gist not found');
    }

    return sendResponse(res, 200, true, gistRes.rows[0], 'Application gist fetched');
  })
);

router.post(
  '/',
  authorize(ROLES.PROPONENT),
  [
    body('project_name').notEmpty(),
    body('sector').notEmpty(),
    body('category').notEmpty(),
    body('location').notEmpty(),
    body('location_lat').isFloat({ min: -90, max: 90 }),
    body('location_lng').isFloat({ min: -180, max: 180 }),
    body('land_area_diameter_km').isFloat({ min: 0.01 }),
    body('forest_land_area_ha').isFloat({ min: 0 }),
    body('water_requirement_kld').isFloat({ min: 0 }),
    body('biodiversity_impact').notEmpty(),
    body('mitigation_measures').notEmpty(),
    body('description').notEmpty(),
    body('impact_summary').notEmpty(),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const {
      project_name,
      sector,
      category,
      location,
      location_lat,
      location_lng,
      land_area_diameter_km,
      forest_land_area_ha,
      water_requirement_kld,
      biodiversity_impact,
      mitigation_measures,
      description,
      impact_summary,
    } = req.body;
    const created = await pool.query(
      `INSERT INTO applications
      (proponent_id, project_name, sector, category, location, location_lat, location_lng,
       land_area_diameter_km, forest_land_area_ha, water_requirement_kld, biodiversity_impact,
       mitigation_measures, description, impact_summary, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        req.user.id,
        project_name,
        sector,
        category,
        location,
        location_lat,
        location_lng,
        land_area_diameter_km,
        forest_land_area_ha,
        water_requirement_kld,
        biodiversity_impact,
        mitigation_measures,
        description,
        impact_summary,
        APP_STATUS.DRAFT,
      ]
    );

    return sendResponse(res, 201, true, created.rows[0], 'Application created in DRAFT');
  })
);

router.put(
  '/:id',
  authorize(ROLES.PROPONENT),
  [
    param('id').isInt(),
    body('location_lat').optional().isFloat({ min: -90, max: 90 }),
    body('location_lng').optional().isFloat({ min: -180, max: 180 }),
    body('land_area_diameter_km').optional().isFloat({ min: 0.01 }),
    body('forest_land_area_ha').optional().isFloat({ min: 0 }),
    body('water_requirement_kld').optional().isFloat({ min: 0 }),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const app = await getApplicationById(req.params.id);
    if (!app) return sendResponse(res, 404, false, null, 'Application not found');
    if (app.proponent_id !== req.user.id) return sendResponse(res, 403, false, null, 'Forbidden');
    if (![APP_STATUS.DRAFT, APP_STATUS.ESSENTIAL_DOC_SOUGHT].includes(app.status)) {
      return sendResponse(res, 400, false, null, 'Application cannot be edited in current status');
    }

    const {
      project_name,
      sector,
      category,
      location,
      location_lat,
      location_lng,
      land_area_diameter_km,
      forest_land_area_ha,
      water_requirement_kld,
      biodiversity_impact,
      mitigation_measures,
      description,
      impact_summary,
    } = req.body;
    const updated = await pool.query(
      `UPDATE applications
       SET project_name = $1,
           sector = $2,
           category = $3,
           location = $4,
           location_lat = $5,
           location_lng = $6,
           land_area_diameter_km = $7,
           forest_land_area_ha = $8,
           water_requirement_kld = $9,
           biodiversity_impact = $10,
           mitigation_measures = $11,
           description = $12,
           impact_summary = $13,
           updated_at = NOW()
       WHERE id = $14
       RETURNING *`,
      [
        project_name,
        sector,
        category,
        location,
        location_lat,
        location_lng,
        land_area_diameter_km,
        forest_land_area_ha,
        water_requirement_kld,
        biodiversity_impact,
        mitigation_measures,
        description,
        impact_summary,
        req.params.id,
      ]
    );

    return sendResponse(res, 200, true, updated.rows[0], 'Application updated');
  })
);

router.post(
  '/:id/submit',
  authorize(ROLES.PROPONENT),
  [param('id').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const app = await getApplicationById(req.params.id);
    if (!app) return sendResponse(res, 404, false, null, 'Application not found');
    if (app.proponent_id !== req.user.id) return sendResponse(res, 403, false, null, 'Forbidden');

    const paymentRes = await pool.query(
      `SELECT id
       FROM payments
       WHERE application_id = $1 AND proponent_id = $2 AND status = 'SUCCESS'
       ORDER BY created_at DESC
       LIMIT 1`,
      [app.id, req.user.id]
    );

    if (!paymentRes.rowCount) {
      return sendResponse(res, 400, false, null, 'Payment required before final submission');
    }

    await transitionApplicationStatus({
      applicationId: app.id,
      changedBy: req.user.id,
      newStatus: APP_STATUS.SUBMITTED,
      notes: 'Submitted by proponent',
    });

    await createNotification(
      req.user.id,
      `Application #${app.id} has been submitted successfully.`,
      {
        subject: `Application #${app.id} Submitted Successfully`,
        title: 'Application Submitted',
        details: [
          { label: 'Application ID', value: `#${app.id}` },
          { label: 'Project Name', value: app.project_name },
          { label: 'Current Status', value: APP_STATUS.SUBMITTED },
        ],
      }
    );

    const scrutinyUsers = await pool.query("SELECT id FROM users WHERE role = 'SCRUTINY'");
    await Promise.all(
      scrutinyUsers.rows.map((u) =>
        createNotification(u.id, `New application #${app.id} submitted and ready for scrutiny.`, {
          subject: `New Submission: Application #${app.id}`,
          title: 'New Application In Queue',
          details: [
            { label: 'Application ID', value: `#${app.id}` },
            { label: 'Project Name', value: app.project_name },
            { label: 'Status', value: APP_STATUS.SUBMITTED },
          ],
        })
      )
    );

    return sendResponse(res, 200, true, null, 'Application submitted');
  })
);

router.post(
  '/:id/resubmit',
  authorize(ROLES.PROPONENT),
  [param('id').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const app = await getApplicationById(req.params.id);
    if (!app) return sendResponse(res, 404, false, null, 'Application not found');
    if (app.proponent_id !== req.user.id) return sendResponse(res, 403, false, null, 'Forbidden');

    await transitionApplicationStatus({
      applicationId: app.id,
      changedBy: req.user.id,
      newStatus: APP_STATUS.UNDER_SCRUTINY,
      notes: 'Resubmitted after EDS',
    });

    await createNotification(
      req.user.id,
      `Application #${app.id} has been resubmitted for scrutiny.`,
      {
        subject: `Application #${app.id} Resubmitted`,
        title: 'Application Resubmitted',
        details: [
          { label: 'Application ID', value: `#${app.id}` },
          { label: 'Project Name', value: app.project_name },
          { label: 'Current Status', value: APP_STATUS.UNDER_SCRUTINY },
        ],
      }
    );

    const scrutinyUsers = await pool.query("SELECT id FROM users WHERE role = 'SCRUTINY'");
    await Promise.all(
      scrutinyUsers.rows.map((u) =>
        createNotification(u.id, `Application #${app.id} has been resubmitted after EDS.`, {
          subject: `Resubmission Received: Application #${app.id}`,
          title: 'Application Back In Scrutiny Queue',
          details: [
            { label: 'Application ID', value: `#${app.id}` },
            { label: 'Project Name', value: app.project_name },
            { label: 'Status', value: APP_STATUS.UNDER_SCRUTINY },
          ],
        })
      )
    );

    return sendResponse(res, 200, true, null, 'Application resubmitted for scrutiny');
  })
);

module.exports = router;

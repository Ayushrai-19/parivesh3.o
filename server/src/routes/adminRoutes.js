const express = require('express');
const bcrypt = require('bcryptjs');
const { body, param } = require('express-validator');

const pool = require('../config/db');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');
const { sendResponse, asyncHandler } = require('../utils/response');
const { sendEmail, buildEmailTemplate } = require('../services/emailService');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.post(
  '/users',
  [
    body('name').optional().trim(),
    body('loginId').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn([ROLES.SCRUTINY, ROLES.MOM]),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, loginId, email, password, role } = req.body;
    const displayName = (name || '').trim() || loginId;

    const exists = await pool.query('SELECT id FROM users WHERE email = $1 OR login_id = $2', [email, loginId]);
    if (exists.rowCount) {
      return sendResponse(res, 409, false, null, 'Email or ID already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, login_id, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, login_id, email, role, created_at`,
      [displayName, loginId, email, hashed, role]
    );

    const createdUser = result.rows[0];

    await sendEmail({
      to: createdUser.email,
      subject: 'PARIVESH Account Created',
      text:
        `Hello ${createdUser.name},\n\n` +
        'An account has been created for you in PARIVESH 3.0.\n\n' +
        `Role: ${createdUser.role}\n` +
        `Login ID: ${createdUser.login_id}\n` +
        `Email: ${createdUser.email}\n` +
        `Temporary Password: ${password}\n\n` +
        'Please change your password after first login.\n\n- PARIVESH 3.0',
      html: buildEmailTemplate({
        title: 'PARIVESH Account Created',
        recipientName: createdUser.name,
        intro: 'An account has been created for you by Admin. Use the credentials below to sign in.',
        details: [
          { label: 'Role', value: createdUser.role },
          { label: 'Login ID', value: createdUser.login_id },
          { label: 'Email', value: createdUser.email },
          { label: 'Temporary Password', value: password },
        ],
        note: 'Please change your password after first login.',
      }),
    });

    return sendResponse(res, 201, true, result.rows[0], 'User created');
  })
);

router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await pool.query(
      `SELECT u.id,
              u.name,
              u.login_id,
              u.email,
              u.role,
              u.created_at,
              la.last_login
       FROM users u
       LEFT JOIN (
         SELECT user_id, MAX(login_at) AS last_login
         FROM login_activity
         GROUP BY user_id
       ) la ON la.user_id = u.id
       WHERE u.role IN ($1, $2, $3)
       ORDER BY u.created_at DESC`,
      [ROLES.SCRUTINY, ROLES.MOM, ROLES.PROPONENT]
    );

    return sendResponse(res, 200, true, users.rows, 'Users fetched');
  })
);

router.get(
  '/login-activity',
  asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;

    const where = ['la.role IN ($1, $2)'];
    const params = [ROLES.SCRUTINY, ROLES.MOM];

    if (req.query.role && [ROLES.SCRUTINY, ROLES.MOM].includes(req.query.role)) {
      params.push(req.query.role);
      where.push(`la.role = $${params.length}`);
    }

    if (req.query.method && ['STANDARD', 'QUICK'].includes(req.query.method)) {
      params.push(req.query.method);
      where.push(`la.login_method = $${params.length}`);
    }

    if (req.query.search) {
      params.push(`%${req.query.search}%`);
      where.push(`(u.name ILIKE $${params.length} OR u.login_id ILIKE $${params.length} OR u.email ILIKE $${params.length} OR COALESCE(la.identifier_used, '') ILIKE $${params.length})`);
    }

    if (req.query.from) {
      params.push(req.query.from);
      where.push(`la.login_at >= $${params.length}::timestamp`);
    }

    if (req.query.to) {
      params.push(req.query.to);
      where.push(`la.login_at <= $${params.length}::timestamp`);
    }

    const whereClause = `WHERE ${where.join(' AND ')}`;

    const dataQuery = `
      SELECT la.id, la.user_id, la.role, la.login_method, la.identifier_used, la.login_at,
             u.name, u.login_id, u.email
      FROM login_activity la
      JOIN users u ON u.id = la.user_id
      ${whereClause}
      ORDER BY la.login_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM login_activity la
      JOIN users u ON u.id = la.user_id
      ${whereClause}
    `;

    const [activity, count] = await Promise.all([
      pool.query(dataQuery, [...params, limit, offset]),
      pool.query(countQuery, params),
    ]);

    return sendResponse(
      res,
      200,
      true,
      {
        items: activity.rows,
        pagination: {
          page,
          limit,
          total: count.rows[0].total,
        },
      },
      'Login activity fetched'
    );
  })
);

router.get(
  '/applications',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const [dataRes, countRes] = await Promise.all([
      pool.query(
        `SELECT a.*, u.name AS proponent_name,
                g.generated_at,
                (g.edited_content IS NOT NULL) AS gist_edited,
                m.id AS mom_id,
                m.finalized_at,
                m.is_locked AS mom_locked,
                mf.name AS mom_finalized_by_name,
                COALESCE(d.documents_count, 0) AS documents_count,
                COALESCE(p.successful_payments, 0) AS successful_payments
         FROM applications a
         JOIN users u ON u.id = a.proponent_id
         LEFT JOIN gists g ON g.application_id = a.id
         LEFT JOIN mom m ON m.application_id = a.id
         LEFT JOIN users mf ON mf.id = m.finalized_by
         LEFT JOIN (
           SELECT application_id, COUNT(*)::int AS documents_count
           FROM documents
           GROUP BY application_id
         ) d ON d.application_id = a.id
         LEFT JOIN (
           SELECT application_id,
                  COUNT(*) FILTER (WHERE status = 'SUCCESS')::int AS successful_payments
           FROM payments
           GROUP BY application_id
         ) p ON p.application_id = a.id
         ORDER BY a.updated_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query('SELECT COUNT(*)::int AS total FROM applications'),
    ]);

    return sendResponse(
      res,
      200,
      true,
      {
        items: dataRes.rows,
        pagination: {
          page,
          limit,
          total: countRes.rows[0].total,
        },
      },
      'Applications fetched'
    );
  })
);

router.get(
  '/payments',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    if (req.query.status) {
      params.push(req.query.status);
      where.push(`p.status = $${params.length}`);
    }

    if (req.query.method) {
      params.push(req.query.method);
      where.push(`p.method = $${params.length}`);
    }

    if (req.query.proponentId) {
      params.push(Number(req.query.proponentId));
      where.push(`p.proponent_id = $${params.length}`);
    }

    if (req.query.search) {
      params.push(`%${req.query.search}%`);
      where.push(`(u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR a.project_name ILIKE $${params.length})`);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const dataQuery = `
      SELECT p.*, u.name AS proponent_name, u.email AS proponent_email, a.project_name, a.status AS application_status
      FROM payments p
      JOIN users u ON u.id = p.proponent_id
      JOIN applications a ON a.id = p.application_id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM payments p
      JOIN users u ON u.id = p.proponent_id
      JOIN applications a ON a.id = p.application_id
      ${whereClause}
    `;

    const summaryQuery = `
      SELECT
        COUNT(*)::int AS total_transactions,
        COUNT(*) FILTER (WHERE p.status = 'SUCCESS')::int AS success_transactions,
        COUNT(*) FILTER (WHERE p.status = 'FAILED')::int AS failed_transactions,
        COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.amount ELSE 0 END), 0)::numeric(12,2) AS successful_amount
      FROM payments p
      JOIN users u ON u.id = p.proponent_id
      JOIN applications a ON a.id = p.application_id
      ${whereClause}
    `;

    const [dataRes, countRes, summaryRes] = await Promise.all([
      pool.query(dataQuery, [...params, limit, offset]),
      pool.query(countQuery, params),
      pool.query(summaryQuery, params),
    ]);

    return sendResponse(
      res,
      200,
      true,
      {
        items: dataRes.rows,
        summary: summaryRes.rows[0],
        pagination: {
          page,
          limit,
          total: countRes.rows[0].total,
        },
      },
      'Admin payments fetched'
    );
  })
);

router.get(
  '/audit-log',
  asyncHandler(async (req, res) => {
    const logs = await pool.query(
      `SELECT al.*, u.name AS changed_by_name
       FROM audit_log al
       LEFT JOIN users u ON u.id = al.changed_by
       ORDER BY al.timestamp DESC`
    );
    return sendResponse(res, 200, true, logs.rows, 'Audit log fetched');
  })
);

router.get(
  '/templates',
  asyncHandler(async (req, res) => {
    const templates = await pool.query('SELECT * FROM templates ORDER BY created_at DESC');
    return sendResponse(res, 200, true, templates.rows, 'Templates fetched');
  })
);

router.post(
  '/templates',
  [body('name').notEmpty(), body('content').notEmpty(), body('sector').notEmpty()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, content, sector } = req.body;
    const created = await pool.query(
      `INSERT INTO templates (name, content, sector, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, content, sector, req.user.id]
    );

    return sendResponse(res, 201, true, created.rows[0], 'Template created');
  })
);

router.put(
  '/templates/:id',
  [param('id').isInt(), body('name').notEmpty(), body('content').notEmpty(), body('sector').notEmpty()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, content, sector } = req.body;
    const updated = await pool.query(
      `UPDATE templates
       SET name = $1, content = $2, sector = $3
       WHERE id = $4
       RETURNING *`,
      [name, content, sector, id]
    );

    if (!updated.rowCount) {
      return sendResponse(res, 404, false, null, 'Template not found');
    }

    return sendResponse(res, 200, true, updated.rows[0], 'Template updated');
  })
);

router.delete(
  '/templates/:id',
  [param('id').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const result = await pool.query('DELETE FROM templates WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rowCount) {
      return sendResponse(res, 404, false, null, 'Template not found');
    }
    return sendResponse(res, 200, true, null, 'Template deleted');
  })
);

router.get(
  '/parameters',
  asyncHandler(async (req, res) => {
    const rows = await pool.query('SELECT * FROM sector_parameters ORDER BY sector ASC');
    return sendResponse(res, 200, true, rows.rows, 'Parameters fetched');
  })
);

router.post(
  '/parameters',
  [body('sector').notEmpty(), body('required_documents').isArray()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { sector, required_documents } = req.body;
    const result = await pool.query(
      `INSERT INTO sector_parameters (sector, required_documents)
       VALUES ($1, $2)
       ON CONFLICT (sector)
       DO UPDATE SET required_documents = EXCLUDED.required_documents
       RETURNING *`,
      [sector, JSON.stringify(required_documents)]
    );
    return sendResponse(res, 200, true, result.rows[0], 'Parameters saved');
  })
);

module.exports = router;

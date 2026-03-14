const express = require('express');
const { body, param } = require('express-validator');

const pool = require('../config/db');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');
const { sendResponse, asyncHandler } = require('../utils/response');
const { createNotification } = require('../services/notificationService');
const { buildChainedHashes } = require('../services/hashChainService');

const router = express.Router();

router.use(authenticate);

router.post(
  '/process',
  authorize(ROLES.PROPONENT),
  [
    body('application_id').isInt(),
    body('amount').isFloat({ gt: 0 }),
    body('method').isIn(['upi', 'debit', 'credit', 'testpay']),
    body('method_label').notEmpty(),
    body('transaction_reference').notEmpty(),
    body('meta').optional().isObject(),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { application_id, amount, method, method_label, transaction_reference, meta = {} } = req.body;

    const appRes = await pool.query('SELECT id, proponent_id, status FROM applications WHERE id = $1', [application_id]);
    if (!appRes.rowCount) return sendResponse(res, 404, false, null, 'Application not found');

    const app = appRes.rows[0];
    if (app.proponent_id !== req.user.id) {
      return sendResponse(res, 403, false, null, 'Forbidden');
    }

    // Allow payment in draft stage (and repeat attempts when needed).
    if (!['DRAFT', 'ESSENTIAL_DOC_SOUGHT'].includes(app.status)) {
      return sendResponse(res, 400, false, null, 'Payment allowed only for draft-stage submissions');
    }

    let status = 'SUCCESS';
    let failureReason = null;

    if (method === 'upi' && String(meta.upiId || '').toLowerCase().includes('fail')) {
      status = 'FAILED';
      failureReason = 'UPI app declined this test transaction.';
    }
    if ((method === 'debit' || method === 'credit') && String(meta.cardNumber || '').replace(/\s/g, '').endsWith('0000')) {
      status = 'FAILED';
      failureReason = 'Issuer bank rejected this card transaction.';
    }
    if (method === 'testpay' && Number(amount) > 50000) {
      status = 'FAILED';
      failureReason = 'Amount exceeds configured test gateway limit.';
    }

    const hashPayload = {
      application_id,
      proponent_id: req.user.id,
      amount: Number(amount),
      method,
      method_label,
      transaction_reference,
      status,
      failure_reason: failureReason,
    };

    const { previousHash, currentHash } = await buildChainedHashes({
      db: pool,
      tableName: 'payments',
      payload: hashPayload,
    });

    const inserted = await pool.query(
      `INSERT INTO payments (
         application_id, proponent_id, amount, method, method_label,
         transaction_reference, status, failure_reason, previous_hash, current_hash, meta
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        application_id,
        req.user.id,
        amount,
        method,
        method_label,
        transaction_reference,
        status,
        failureReason,
        previousHash,
        currentHash,
        JSON.stringify(meta),
      ]
    );

    await createNotification(
      req.user.id,
      status === 'SUCCESS'
        ? `Payment successful for Application #${application_id}. Reference: ${transaction_reference}`
        : `Payment failed for Application #${application_id}. Reason: ${failureReason}`,
      {
        subject:
          status === 'SUCCESS'
            ? `Payment Success: Application #${application_id}`
            : `Payment Failed: Application #${application_id}`,
        title: status === 'SUCCESS' ? 'Payment Successful' : 'Payment Failed',
        details: [
          { label: 'Application ID', value: `#${application_id}` },
          { label: 'Amount', value: `INR ${Number(amount).toFixed(2)}` },
          { label: 'Method', value: method_label },
          { label: 'Reference', value: transaction_reference },
          { label: 'Status', value: status },
        ],
        note: status === 'FAILED' ? failureReason : 'You can proceed with submission if payment is complete.',
      }
    );

    const code = status === 'SUCCESS' ? 201 : 400;
    return sendResponse(
      res,
      code,
      status === 'SUCCESS',
      inserted.rows[0],
      status === 'SUCCESS' ? 'Payment recorded successfully' : failureReason
    );
  })
);

router.get(
  '/history',
  authorize(ROLES.PROPONENT, ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const isAdmin = req.user.role === ROLES.ADMIN;
    const whereClause = isAdmin ? '' : 'WHERE p.proponent_id = $1';
    const queryParams = isAdmin ? [limit, offset] : [req.user.id, limit, offset];
    const countParams = isAdmin ? [] : [req.user.id];

    const [rows, count] = await Promise.all([
      pool.query(
        `SELECT p.*, a.project_name, a.status AS application_status
         FROM payments p
         JOIN applications a ON a.id = p.application_id
         ${whereClause}
         ORDER BY p.created_at DESC
         LIMIT $${isAdmin ? 1 : 2} OFFSET $${isAdmin ? 2 : 3}`,
        queryParams
      ),
      pool.query(
        `SELECT COUNT(*)::int AS total
         FROM payments p
         ${isAdmin ? '' : 'WHERE p.proponent_id = $1'}`,
        countParams
      ),
    ]);

    return sendResponse(
      res,
      200,
      true,
      {
        items: rows.rows,
        pagination: { page, limit, total: count.rows[0].total },
      },
      'Payment history fetched'
    );
  })
);

router.get(
  '/application/:applicationId',
  authorize(ROLES.PROPONENT, ROLES.ADMIN, ROLES.SCRUTINY, ROLES.MOM),
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const appRes = await pool.query('SELECT id, proponent_id FROM applications WHERE id = $1', [req.params.applicationId]);
    if (!appRes.rowCount) return sendResponse(res, 404, false, null, 'Application not found');

    if (req.user.role === ROLES.PROPONENT && appRes.rows[0].proponent_id !== req.user.id) {
      return sendResponse(res, 403, false, null, 'Forbidden');
    }

    const rows = await pool.query(
      `SELECT id, application_id, amount, method, method_label, transaction_reference, status, failure_reason, created_at
       FROM payments
       WHERE application_id = $1
       ORDER BY created_at DESC`,
      [req.params.applicationId]
    );

    return sendResponse(res, 200, true, rows.rows, 'Application payment history fetched');
  })
);

module.exports = router;

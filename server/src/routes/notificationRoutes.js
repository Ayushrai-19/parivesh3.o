const express = require('express');
const { param } = require('express-validator');

const pool = require('../config/db');
const authenticate = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { sendResponse, asyncHandler } = require('../utils/response');

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const rows = await pool.query(
      `SELECT id, user_id, message, is_read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    const unread = rows.rows.filter((n) => !n.is_read).length;
    return sendResponse(res, 200, true, { items: rows.rows, unreadCount: unread }, 'Notifications fetched');
  })
);

router.patch(
  '/:id/read',
  [param('id').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const updated = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (!updated.rowCount) {
      return sendResponse(res, 404, false, null, 'Notification not found');
    }
    return sendResponse(res, 200, true, updated.rows[0], 'Notification marked as read');
  })
);

module.exports = router;

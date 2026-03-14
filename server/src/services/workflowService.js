const pool = require('../config/db');
const { VALID_TRANSITIONS } = require('../utils/constants');
const { buildChainedHashes } = require('./hashChainService');

const assertTransitionAllowed = (fromStatus, toStatus) => {
  const next = VALID_TRANSITIONS[fromStatus] || [];
  return next.includes(toStatus);
};

const transitionApplicationStatus = async ({
  applicationId,
  changedBy,
  newStatus,
  notes = '',
  client = null,
}) => {
  const db = client || pool;
  const appRes = await db.query('SELECT id, status FROM applications WHERE id = $1', [applicationId]);
  if (!appRes.rowCount) {
    const err = new Error('Application not found');
    err.status = 404;
    throw err;
  }

  const currentStatus = appRes.rows[0].status;
  if (!assertTransitionAllowed(currentStatus, newStatus)) {
    const err = new Error(`Invalid transition: ${currentStatus} -> ${newStatus}`);
    err.status = 400;
    throw err;
  }

  await db.query(
    `UPDATE applications
     SET status = $1, updated_at = NOW()
     WHERE id = $2`,
    [newStatus, applicationId]
  );

  const { previousHash, currentHash } = await buildChainedHashes({
    db,
    tableName: 'audit_log',
    payload: {
      application_id: applicationId,
      changed_by: changedBy,
      old_status: currentStatus,
      new_status: newStatus,
      notes,
    },
  });

  await db.query(
    `INSERT INTO audit_log (application_id, changed_by, old_status, new_status, previous_hash, current_hash, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [applicationId, changedBy, currentStatus, newStatus, previousHash, currentHash, notes]
  );

  return { oldStatus: currentStatus, newStatus };
};

module.exports = {
  transitionApplicationStatus,
  assertTransitionAllowed,
};

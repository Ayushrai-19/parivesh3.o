const crypto = require('crypto');

const GENESIS_HASH = '0'.repeat(64);

const TABLE_CONFIG = {
  login_activity: { hashColumn: 'current_hash', orderColumn: 'id' },
  payments: { hashColumn: 'current_hash', orderColumn: 'id' },
  audit_log: { hashColumn: 'current_hash', orderColumn: 'id' },
};

const canonicalStringify = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map((item) => canonicalStringify(item)).join(',')}]`;
  }

  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalStringify(obj[k])}`).join(',')}}`;
};

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

const getPreviousHash = async (db, tableName) => {
  const config = TABLE_CONFIG[tableName];
  if (!config) {
    throw new Error(`Unsupported hash chain table: ${tableName}`);
  }

  const { hashColumn, orderColumn } = config;
  const query = `SELECT ${hashColumn} FROM ${tableName} ORDER BY ${orderColumn} DESC LIMIT 1`;
  const result = await db.query(query);

  if (!result.rowCount || !result.rows[0][hashColumn]) {
    return GENESIS_HASH;
  }

  return result.rows[0][hashColumn];
};

const buildChainedHashes = async ({ db, tableName, payload }) => {
  const previousHash = await getPreviousHash(db, tableName);
  const serializedPayload = canonicalStringify(payload || {});
  const currentHash = sha256(`${previousHash}:${serializedPayload}`);

  return {
    previousHash,
    currentHash,
  };
};

module.exports = {
  GENESIS_HASH,
  buildChainedHashes,
  canonicalStringify,
};

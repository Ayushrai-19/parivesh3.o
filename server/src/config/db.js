const { Pool } = require('pg');
const { newDb } = require('pg-mem');
const { initMemoryDb } = require('./memoryDb');

const forceInMemory = process.env.USE_INMEMORY_DB === 'true' || !process.env.DATABASE_URL;
const pgPool = forceInMemory
  ? null
  : new Pool({
      connectionString: process.env.DATABASE_URL,
    });

let activePool = pgPool;
let memoryInitPromise = null;

const isConnectionError = (error) => {
  if (!error) return false;
  const code = String(error.code || '');
  const message = String(error.message || '').toLowerCase();
  return (
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'EHOSTUNREACH' ||
    message.includes('connect econnrefused') ||
    message.includes('connection terminated') ||
    message.includes('the server closed the connection unexpectedly')
  );
};

const switchToMemory = async () => {
  if (memoryInitPromise) {
    await memoryInitPromise;
    return;
  }

  memoryInitPromise = (async () => {
    const mem = newDb();
    const adapter = mem.adapters.createPg();
    const memPool = new adapter.Pool();
    await initMemoryDb(memPool);
    activePool = memPool;
    // eslint-disable-next-line no-console
    console.log('Using in-memory database mode (pg-mem).');
  })();

  await memoryInitPromise;
};

if (forceInMemory) {
  switchToMemory().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize in-memory database:', error);
    process.exit(1);
  });
}

const db = {
  async query(text, params) {
    try {
      return await activePool.query(text, params);
    } catch (error) {
      if (!forceInMemory && activePool === pgPool && isConnectionError(error)) {
        await switchToMemory();
        return activePool.query(text, params);
      }
      throw error;
    }
  },
  async connect() {
    try {
      return await activePool.connect();
    } catch (error) {
      if (!forceInMemory && activePool === pgPool && isConnectionError(error)) {
        await switchToMemory();
        return activePool.connect();
      }
      throw error;
    }
  },
  async end() {
    if (activePool && typeof activePool.end === 'function') {
      return activePool.end();
    }
    return null;
  },
};

module.exports = db;

const pool = require('../config/db');
const { APP_STATUS } = require('../utils/constants');
const { transitionApplicationStatus } = require('./workflowService');
const { generateGistWithAI } = require('./aiService');

const normalizeSector = (sector) => String(sector || '').trim().toLowerCase();

const sectorAliases = {
  renewable: 'power',
  'renewable energy': 'power',
  manufacturing: 'industry',
  realestate: 'infrastructure',
  'real estate': 'infrastructure',
};

const resolveTemplateSectorCandidates = (sector) => {
  const normalized = normalizeSector(sector);
  const alias = sectorAliases[normalized];
  return Array.from(new Set([normalized, alias].filter(Boolean)));
};

const applyTemplateVariables = (templateContent, payload) => {
  return templateContent
    .replaceAll('{{project_name}}', payload.project_name || '')
    .replaceAll('{{sector}}', payload.sector || '')
    .replaceAll('{{location}}', payload.location || '')
    .replaceAll('{{description}}', payload.description || '')
    .replaceAll('{{proponent_name}}', payload.proponent_name || '');
};

const autoGenerateGistAndPromote = async ({ applicationId, changedBy }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const appRes = await client.query(
      `SELECT a.id, a.project_name, a.sector, a.location, a.description, a.status,
              u.name AS proponent_name
       FROM applications a
       JOIN users u ON u.id = a.proponent_id
       WHERE a.id = $1`,
      [applicationId]
    );

    if (!appRes.rowCount) {
      const err = new Error('Application not found');
      err.status = 404;
      throw err;
    }

    const app = appRes.rows[0];
    if (app.status !== APP_STATUS.REFERRED) {
      const err = new Error('Application must be in REFERRED status for gist generation');
      err.status = 400;
      throw err;
    }

    const candidates = resolveTemplateSectorCandidates(app.sector);

    let templateRes = { rowCount: 0, rows: [] };
    if (candidates.length) {
      templateRes = await client.query(
        `SELECT id, content
         FROM templates
         WHERE LOWER(sector) = ANY($1)
         ORDER BY created_at DESC
         LIMIT 1`,
        [candidates]
      );
    }

    if (!templateRes.rowCount) {
      templateRes = await client.query(
        `SELECT id, content
         FROM templates
         ORDER BY created_at DESC
         LIMIT 1`
      );
    }

    if (!templateRes.rowCount) {
      const err = new Error(`No template found for sector: ${app.sector}`);
      err.status = 400;
      throw err;
    }

    const template = templateRes.rows[0];
    const populated = applyTemplateVariables(template.content, app);

    await client.query(
      `INSERT INTO gists (application_id, content)
       VALUES ($1, $2)
       ON CONFLICT (application_id)
       DO UPDATE SET content = EXCLUDED.content, generated_at = NOW(), edited_content = NULL, edited_by = NULL`,
      [applicationId, populated]
    );

    await transitionApplicationStatus({
      applicationId,
      changedBy,
      newStatus: APP_STATUS.MOM_GENERATED,
      notes: 'Auto-generated gist from sector template',
      client,
    });

    await client.query('COMMIT');
    return populated;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const aiRegenerateGist = async ({ applicationId, changedBy }) => {
  const appRes = await pool.query(
    `SELECT a.id, a.project_name, a.sector, a.location, a.description, a.impact_summary,
            u.name AS proponent_name
     FROM applications a
     JOIN users u ON u.id = a.proponent_id
     WHERE a.id = $1`,
    [applicationId]
  );

  if (!appRes.rowCount) {
    throw Object.assign(new Error('Application not found'), { status: 404 });
  }

  const aiContent = await generateGistWithAI(appRes.rows[0]);

  const result = await pool.query(
    `UPDATE gists
     SET edited_content = $1, edited_by = $2
     WHERE application_id = $3
     RETURNING *`,
    [aiContent, changedBy, applicationId]
  );

  if (!result.rowCount) {
    throw Object.assign(new Error('Gist not found — application must be referred first'), { status: 404 });
  }

  return result.rows[0];
};

module.exports = {
  autoGenerateGistAndPromote,
  aiRegenerateGist,
};

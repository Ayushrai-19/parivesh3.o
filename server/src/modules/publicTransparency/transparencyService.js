const pool = require('../../config/db');

const WORKFLOW_STAGES = ['DRAFT', 'SUBMITTED', 'UNDER_SCRUTINY', 'REFERRED', 'MOM_GENERATED', 'FINALIZED'];
const PUBLIC_STATUSES = ['SUBMITTED', 'UNDER_SCRUTINY', 'REFERRED', 'MOM_GENERATED', 'FINALIZED'];

const toSlugStatus = (status) => (status || '').trim().toUpperCase().replace(/[\s-]+/g, '_');

const normalizePublicStatus = (status) => {
  const normalized = toSlugStatus(status);
  if (!normalized) return null;

  const aliasMap = {
    UNDERSCRUTINY: 'UNDER_SCRUTINY',
    MOMGENERATED: 'MOM_GENERATED',
  };

  const mapped = aliasMap[normalized] || normalized;
  return PUBLIC_STATUSES.includes(mapped) ? mapped : null;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const estimateRiskScore = ({ sector = '', description = '', impactSummary = '' }) => {
  const text = `${sector} ${description} ${impactSummary}`.toLowerCase();
  let score = 35;

  const highImpactTerms = ['coal', 'mining', 'thermal', 'steel', 'chemical', 'cement', 'refinery', 'dam'];
  const mediumImpactTerms = ['forest', 'deforestation', 'wildlife', 'water', 'coastal', 'emission', 'discharge'];
  const positiveTerms = ['solar', 'wind', 'renewable', 'mitigation', 'reforestation', 'recycling', 'green belt'];

  highImpactTerms.forEach((term) => {
    if (text.includes(term)) score += 8;
  });

  mediumImpactTerms.forEach((term) => {
    if (text.includes(term)) score += 4;
  });

  positiveTerms.forEach((term) => {
    if (text.includes(term)) score -= 3;
  });

  return clamp(score, 8, 96);
};

const riskBand = (score) => {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MODERATE';
  return 'LOW';
};

const summarizeText = (text, maxLen = 220) => {
  if (!text) return '';
  const compact = String(text).replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLen) return compact;
  return `${compact.slice(0, maxLen - 3)}...`;
};

const extractMomSummary = (content) => {
  if (!content) return null;

  try {
    const parsed = JSON.parse(content);
    const summary = [parsed.committee_discussion, parsed.salient_features, parsed.opening_remarks]
      .filter(Boolean)
      .join(' ');
    return summarizeText(summary, 260) || null;
  } catch {
    const sanitized = String(content)
      .replace(/---/g, ' ')
      .replace(/[\r\n]+/g, ' ')
      .trim();
    return summarizeText(sanitized, 260) || null;
  }
};

const hashLocationToCoordinates = (location) => {
  const value = String(location || 'India');
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);
  const lat = 8 + ((abs % 2900) / 100);
  const lng = 68 + (((abs * 7) % 2900) / 100);
  return {
    map_lat: Number(lat.toFixed(4)),
    map_lng: Number(lng.toFixed(4)),
  };
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const resolveCoordinates = ({ location, location_lat, location_lng }) => {
  const lat = toNumberOrNull(location_lat);
  const lng = toNumberOrNull(location_lng);
  if (lat !== null && lng !== null) {
    return {
      map_lat: Number(lat.toFixed(6)),
      map_lng: Number(lng.toFixed(6)),
      map_source: 'EXACT_COORDINATES',
    };
  }

  return {
    ...hashLocationToCoordinates(location),
    map_source: 'LOCATION_HASH_FALLBACK',
  };
};

const buildWorkflowProgress = (currentStatus) =>
  WORKFLOW_STAGES.map((stage, index) => {
    const currentIndex = WORKFLOW_STAGES.indexOf(currentStatus);
    return {
      stage,
      order: index + 1,
      is_current: stage === currentStatus,
      is_completed: currentIndex >= index,
    };
  });

const computeAuditIntegrity = async (applicationId) => {
  const result = await pool.query(
    `SELECT previous_hash, current_hash
     FROM audit_log
     WHERE application_id = $1
     ORDER BY id ASC`,
    [applicationId]
  );

  if (!result.rowCount) {
    return 'NOT_AVAILABLE';
  }

  const hashRegex = /^[a-f0-9]{64}$/i;
  const isValid = result.rows.every(
    (row) => hashRegex.test(String(row.previous_hash || '')) && hashRegex.test(String(row.current_hash || ''))
  );

  return isValid ? 'VERIFIED' : 'UNVERIFIED';
};

const buildListQuery = ({ status, sector, location }) => {
  const params = [];
  const where = [];

  const statuses = status ? [status] : PUBLIC_STATUSES;
  const statusPlaceholders = statuses.map((value) => {
    params.push(value);
    return `$${params.length}`;
  });
  where.push(`a.status IN (${statusPlaceholders.join(', ')})`);

  if (sector) {
    params.push(`%${sector.trim()}%`);
    where.push(`a.sector ILIKE $${params.length}`);
  }

  if (location) {
    params.push(`%${location.trim()}%`);
    where.push(`a.location ILIKE $${params.length}`);
  }

  return {
    sql: `
      SELECT
        a.id AS application_id,
        a.project_name,
        a.sector,
        a.location AS project_location,
        a.created_at AS submission_date,
        a.status AS current_status,
        a.description,
        a.impact_summary,
        a.location_lat,
        a.location_lng,
        a.land_area_diameter_km,
        a.forest_land_area_ha,
        a.water_requirement_kld,
        a.biodiversity_impact,
        a.mitigation_measures,
        g.content AS gist_content,
        g.edited_content AS gist_edited_content,
        m.content AS mom_content,
        COALESCE(docs.documents_count, 0) AS documents_count,
        COALESCE(pay.successful_payments, 0) AS successful_payments
      FROM applications a
      LEFT JOIN gists g ON g.application_id = a.id
      LEFT JOIN mom m ON m.application_id = a.id
      LEFT JOIN (
        SELECT application_id, COUNT(*)::int AS documents_count
        FROM documents
        GROUP BY application_id
      ) docs ON docs.application_id = a.id
      LEFT JOIN (
        SELECT application_id, COUNT(*)::int AS successful_payments
        FROM payments
        WHERE status = 'SUCCESS'
        GROUP BY application_id
      ) pay ON pay.application_id = a.id
      WHERE ${where.join(' AND ')}
      ORDER BY a.updated_at DESC
    `,
    params,
  };
};

const toPublicProjectRow = async (row) => {
  const score = estimateRiskScore({
    sector: row.sector,
    description: row.description,
    impactSummary: row.impact_summary,
  });
  const band = riskBand(score);

  const diameterKm = toNumberOrNull(row.land_area_diameter_km);
  const circleVisible = Number(row.documents_count || 0) > 0 && Number(row.successful_payments || 0) > 0 && diameterKm !== null;

  return {
    application_id: row.application_id,
    project_name: row.project_name,
    sector: row.sector,
    project_location: row.project_location,
    submission_date: row.submission_date,
    current_status: row.current_status,
    environmental_risk_score: score,
    environmental_risk_band: band,
    approval_decision: row.current_status === 'FINALIZED' ? 'FINALIZED' : null,
    ai_summary: summarizeText(row.gist_edited_content || row.gist_content || row.impact_summary, 220) || null,
    audit_integrity: await computeAuditIntegrity(row.application_id),
    circle_radius_m: circleVisible ? Number(((diameterKm * 1000) / 2).toFixed(2)) : null,
    circle_visible: circleVisible,
    ...resolveCoordinates({
      location: row.project_location,
      location_lat: row.location_lat,
      location_lng: row.location_lng,
    }),
  };
};

const getPublicProjects = async ({ sector, status, location }) => {
  const normalizedStatus = normalizePublicStatus(status);
  const query = buildListQuery({
    status: normalizedStatus,
    sector,
    location,
  });

  const result = await pool.query(query.sql, query.params);
  const items = await Promise.all(result.rows.map((row) => toPublicProjectRow(row)));

  return {
    items,
    filters_applied: {
      sector: sector || null,
      status: normalizedStatus || null,
      location: location || null,
    },
  };
};

const getPublicProjectById = async (applicationId) => {
  const result = await pool.query(
    `
      SELECT
        a.id AS application_id,
        a.project_name,
        a.sector,
        a.location AS project_location,
        a.created_at AS submission_date,
        a.status AS current_status,
        a.location_lat,
        a.location_lng,
        a.land_area_diameter_km,
        a.forest_land_area_ha,
        a.water_requirement_kld,
        a.biodiversity_impact,
        a.mitigation_measures,
        a.description,
        a.impact_summary,
        g.content AS gist_content,
        g.edited_content AS gist_edited_content,
        m.content AS mom_content,
        COALESCE(docs.documents_count, 0) AS documents_count,
        COALESCE(pay.successful_payments, 0) AS successful_payments
      FROM applications a
      LEFT JOIN gists g ON g.application_id = a.id
      LEFT JOIN mom m ON m.application_id = a.id
      LEFT JOIN (
        SELECT application_id, COUNT(*)::int AS documents_count
        FROM documents
        GROUP BY application_id
      ) docs ON docs.application_id = a.id
      LEFT JOIN (
        SELECT application_id, COUNT(*)::int AS successful_payments
        FROM payments
        WHERE status = 'SUCCESS'
        GROUP BY application_id
      ) pay ON pay.application_id = a.id
      WHERE a.id = $1
      LIMIT 1
    `,
    [applicationId]
  );

  if (!result.rowCount) return null;

  const row = result.rows[0];
  if (!PUBLIC_STATUSES.includes(row.current_status)) {
    return null;
  }

  const score = estimateRiskScore({
    sector: row.sector,
    description: row.description,
    impactSummary: row.impact_summary,
  });
  const band = riskBand(score);
  const diameterKm = toNumberOrNull(row.land_area_diameter_km);
  const circleVisible = Number(row.documents_count || 0) > 0 && Number(row.successful_payments || 0) > 0 && diameterKm !== null;

  return {
    application_id: row.application_id,
    project_name: row.project_name,
    sector: row.sector,
    location: row.project_location,
    submission_date: row.submission_date,
    current_status: row.current_status,
    approval_decision: row.current_status === 'FINALIZED' ? 'FINALIZED' : null,
    environmental_risk_score: score,
    environmental_risk_band: band,
    environmental_risk_summary:
      summarizeText(row.impact_summary, 320) || `Estimated ${band.toLowerCase()} environmental risk profile based on submitted project details.`,
    ai_summary: summarizeText(row.gist_edited_content || row.gist_content || row.impact_summary, 280) || null,
    mom_summary: row.current_status === 'FINALIZED' ? extractMomSummary(row.mom_content) : null,
    audit_integrity: await computeAuditIntegrity(row.application_id),
    workflow_progress: buildWorkflowProgress(row.current_status),
    land_area_diameter_km: diameterKm,
    forest_land_area_ha: toNumberOrNull(row.forest_land_area_ha),
    water_requirement_kld: toNumberOrNull(row.water_requirement_kld),
    biodiversity_impact: row.biodiversity_impact || null,
    mitigation_measures: row.mitigation_measures || null,
    circle_radius_m: circleVisible ? Number(((diameterKm * 1000) / 2).toFixed(2)) : null,
    circle_visible: circleVisible,
    ...resolveCoordinates({
      location: row.project_location,
      location_lat: row.location_lat,
      location_lng: row.location_lng,
    }),
  };
};

module.exports = {
  PUBLIC_STATUSES,
  normalizePublicStatus,
  getPublicProjects,
  getPublicProjectById,
};

const { param, query } = require('express-validator');

const { sendResponse, asyncHandler } = require('../../utils/response');
const {
  normalizePublicStatus,
  getPublicProjects,
  getPublicProjectById,
} = require('./transparencyService');

const listProjectsValidators = [
  query('sector').optional().isString(),
  query('location').optional().isString(),
  query('status').optional().isString(),
];

const projectDetailValidators = [param('application_id').isInt({ min: 1 })];

const listPublicProjects = asyncHandler(async (req, res) => {
  const normalizedStatus = req.query.status ? normalizePublicStatus(req.query.status) : null;
  if (req.query.status && !normalizedStatus) {
    return sendResponse(
      res,
      400,
      false,
      null,
      'Invalid status filter. Allowed: SUBMITTED, UNDER_SCRUTINY, REFERRED, MOM_GENERATED, FINALIZED'
    );
  }

  const data = await getPublicProjects({
    sector: req.query.sector,
    location: req.query.location,
    status: normalizedStatus,
  });

  return sendResponse(res, 200, true, data, 'Public transparency projects fetched');
});

const getPublicProjectDetail = asyncHandler(async (req, res) => {
  const data = await getPublicProjectById(Number(req.params.application_id));
  if (!data) {
    return sendResponse(res, 404, false, null, 'Public project not found');
  }

  return sendResponse(res, 200, true, data, 'Public project transparency detail fetched');
});

module.exports = {
  listProjectsValidators,
  projectDetailValidators,
  listPublicProjects,
  getPublicProjectDetail,
};

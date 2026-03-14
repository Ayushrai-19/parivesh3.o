const express = require('express');

const validateRequest = require('../../middlewares/validateRequest');
const {
  listProjectsValidators,
  projectDetailValidators,
  listPublicProjects,
  getPublicProjectDetail,
} = require('./transparencyController');

const router = express.Router();

router.get('/projects', listProjectsValidators, validateRequest, listPublicProjects);
router.get('/project/:application_id', projectDetailValidators, validateRequest, getPublicProjectDetail);

module.exports = router;

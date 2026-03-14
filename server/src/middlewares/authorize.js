const { sendResponse } = require('../utils/response');

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return sendResponse(res, 403, false, null, 'Forbidden: insufficient permissions');
  }

  return next();
};

module.exports = authorize;

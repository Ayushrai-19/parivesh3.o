const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_insecure_secret_change_me';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return sendResponse(res, 401, false, null, 'Authentication token missing');
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return sendResponse(res, 401, false, null, 'Invalid or expired token');
  }
};

module.exports = authenticate;

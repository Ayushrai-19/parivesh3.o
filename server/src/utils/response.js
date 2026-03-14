const sendResponse = (res, status, success, data, message) => {
  return res.status(status).json({ success, data, message });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  sendResponse,
  asyncHandler,
};

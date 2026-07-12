const { sendResponse } = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  sendResponse(res, 404, false, 'Route not found', {});
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  sendResponse(res, statusCode, false, err.message || 'Server error', {});
};

module.exports = { notFound, errorHandler };

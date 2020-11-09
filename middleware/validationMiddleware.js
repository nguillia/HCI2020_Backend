const { handleResponse } = require('../services/utils');
const { validationResult } = require('express-validator');

const validationMiddleware = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return handleResponse(req, res, 400, {}, errors);
  next();
};

module.exports = {
  validationMiddleware,
};

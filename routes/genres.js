const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getGenres } = require('../database/utils/genres');
const { check } = require('express-validator');
const { validationMiddleware } = require('../middleware/validationMiddleware');

router.get('/', async (req, res) => {
  try {
    return handleResponse(req, res, 200, { success: true, data: await getGenres() });
  } catch (err) {
    return handleResponse(req, res, 400, {}, err);
  }
});

module.exports = router;

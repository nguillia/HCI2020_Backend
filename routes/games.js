const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getGames } = require('../database/utils/games');
const { check } = require('express-validator');
const { validationMiddleware } = require('../middleware/validationMiddleware');

router.get('/', async (req, res) => {
  try {
    return handleResponse(req, res, 200, { success: true, data: await getGames({ limit: 10 }) });
  } catch (err) {
    return handleResponse(req, res, 400, {}, err);
  }
});

router.post('/', [check('limit').optional().toInt().isInt(), validationMiddleware], async (req, res) => {
  try {
    return handleResponse(req, res, 200, {
      success: true,
      data: await getGames(req.body.limit && { limit: req.body.limit }),
    });
  } catch (err) {
    return handleResponse(req, res, 400, {}, err);
  }
});

module.exports = router;

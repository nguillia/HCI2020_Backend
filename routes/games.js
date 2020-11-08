const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getGames } = require('../database/utils/games');
const { check, body, validationResult } = require('express-validator');

router.get('/list', async (req, res) => {
  try {
    return handleResponse(req, res, 200, { success: true, data: await getGames({ limit: 2 }) });
  } catch (err) {
    return handleResponse(req, res, 400, {}, err);
  }
});

router.post('/list', [check('limit').optional().toInt().isInt()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return handleResponse(req, res, 400, {}, errors);
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

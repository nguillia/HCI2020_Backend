const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getGames } = require('../database/utils/games');
const { check } = require('express-validator');
const { validationMiddleware } = require('../middleware/validationMiddleware');

router.post(
  '/',
  [
    check('limit')
      .exists()
      .withMessage('Empty Field: limit is required.')
      .toInt()
      .isInt()
      .withMessage('Integer Error: limit should be an integer value.'),
    validationMiddleware,
  ],
  async (req, res) => {
    try {
      return handleResponse(req, res, 200, {
        success: true,
        data: await getGames(req.body.limit),
      });
    } catch (err) {
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

router.post(
  '/game',
  [
    check('gameId')
      .exists()
      .withMessage('Empty Field: gameId is required.')
      .toInt()
      .isInt()
      .withMessage('Integer Error: gameId should be an integer value.'),
    validationMiddleware,
  ],
  async (req, res) => {
    try {
      return handleResponse(req, res, 200, {
        success: true,
        data: await getGamesWithId({ id: req.body.gameId }),
      });
    } catch (err) {
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

module.exports = router;

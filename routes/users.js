const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getUserInfo, dislikeGenres, likeDislikeGames } = require('../database/utils/users');
const { getGenres } = require('../database/utils/genres');
const { getGamesWithIds } = require('../database/utils/games');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { Game } = require('../database/init');
const { check } = require('express-validator');
const _ = require('lodash');

router.post('/user', [check('id').toInt().isInt().not().isEmpty(), validationMiddleware], async (req, res) => {
  try {
    const user = await getUserInfo({ id: req.body.id });
    if (user) return handleResponse(req, res, 200, { success: true, data: user });
    else return handleResponse(req, res, 400, {}, 'User not found.');
  } catch (err) {
    return handleResponse(req, res, 400, {}, err);
  }
});

router.post(
  '/dislike_genres',
  [check('id').toInt().isInt().not().isEmpty(), check('genres').not().isEmpty(), validationMiddleware],
  async (req, res) => {
    try {
      if (req.body.genres.length < 1) return handleResponse(req, res, 400, {}, 'No Genres array passed.');
      return handleResponse(req, res, 200, {
        success: true,
        data: { genres: await dislikeGenres({ userId: req.body.id, genres: req.body.genres }) },
      });
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

router.post(
  '/dislike_games',
  [check('id').toInt().isInt().not().isEmpty(), check('games').not().isEmpty(), validationMiddleware],
  async (req, res) => {
    try {
      if (req.body.games.length < 1) return handleResponse(req, res, 400, {}, 'No Games array passed.');
      return handleResponse(req, res, 200, {
        success: true,
        data: { games: await likeDislikeGames({ userId: req.body.id, games: req.body.games, like: 0 }) },
      });
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

router.post(
  '/like_games',
  [check('id').toInt().isInt().not().isEmpty(), check('games').not().isEmpty(), validationMiddleware],
  async (req, res) => {
    try {
      if (req.body.games.length < 1) return handleResponse(req, res, 400, {}, 'No Games array passed.');
      return handleResponse(req, res, 200, {
        success: true,
        data: { games: await likeDislikeGames({ userId: req.body.id, games: req.body.games, like: 1 }) },
      });
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

module.exports = router;

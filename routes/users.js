const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getUserInfo, updateGenres, likeDislikeGames, removeUserGamesLink } = require('../database/utils/users');
const { isUser, isValidArray, toIntegerArray } = require('../middleware/validator');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { check } = require('express-validator');

router.post('/user', [check('id').toInt().isInt().not().isEmpty(), validationMiddleware], async (req, res) => {
  try {
    if (user)
      return handleResponse(req, res, 200, { success: true, data: { user: await getUserInfo({ id: req.body.id }) } });
    else return handleResponse(req, res, 400, {}, 'User not found.');
  } catch (err) {
    return handleResponse(req, res, 400, {}, err);
  }
});

router.post(
  '/user/dislike_genres',
  [
    check('id')
      .toInt()
      .isInt()
      .not()
      .isEmpty()
      .custom(async (value, { req }) => await isUser(value, req)),
    check('genres')
      .custom((value) => isValidArray(value))
      .customSanitizer((value) => toIntegerArray(value)),
    validationMiddleware,
  ],
  async (req, res) => {
    try {
      return handleResponse(req, res, 200, {
        success: true,
        data: { genres: await updateGenres({ userObj: req.body.user, genreIds: req.body.genres }) },
      });
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

router.post(
  '/user/dislike_games',
  [
    check('id')
      .toInt()
      .isInt()
      .not()
      .isEmpty()
      .custom(async (value, { req }) => await isUser(value, req)),
    check('games')
      .custom((value) => isValidArray(value))
      .customSanitizer((value) => toIntegerArray(value)),
    validationMiddleware,
  ],
  async (req, res) => {
    try {
      if (req.body.games.length < 1) return handleResponse(req, res, 400, {}, 'No Games array passed.');
      return handleResponse(req, res, 200, {
        success: true,
        data: { games: await likeDislikeGames({ userObj: req.body.user, gameIds: req.body.games, like: 0 }) },
      });
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

router.post(
  '/user/like_games',
  [
    check('id')
      .toInt()
      .isInt()
      .not()
      .isEmpty()
      .custom(async (value, { req }) => await isUser(value, req)),
    check('games')
      .custom((value) => isValidArray(value))
      .customSanitizer((value) => toIntegerArray(value)),
    validationMiddleware,
  ],
  async (req, res) => {
    try {
      if (req.body.games.length < 1) return handleResponse(req, res, 400, {}, 'No Games array passed.');
      return handleResponse(req, res, 200, {
        success: true,
        data: { games: await likeDislikeGames({ userObj: req.body.user, gameIds: req.body.games, like: 1 }) },
      });
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

router.post(
  '/user/remove_games',
  [
    check('id')
      .toInt()
      .isInt()
      .not()
      .isEmpty()
      .custom(async (value, { req }) => await isUser(value, req)),
    check('games')
      .custom((value) => isValidArray(value))
      .customSanitizer((value) => toIntegerArray(value)),
    validationMiddleware,
  ],
  async (req, res) => {
    try {
      if (req.body.games.length < 1) return handleResponse(req, res, 400, {}, 'No Games array passed.');
      return handleResponse(req, res, 200, {
        success: true,
        data: { games: await removeUserGamesLink({ userObj: req.body.user, gameIds: req.body.games }) },
      });
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

module.exports = router;

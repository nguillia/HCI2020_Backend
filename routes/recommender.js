const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getRecommendations, getInitialRecommendations } = require('../database/utils/recommender');
const { updateGenres } = require('../database/utils/users');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const { isValidArray, toIntegerArray } = require('../middleware/validator');
const { check } = require('express-validator');
const _ = require('lodash');

router.get('/recommend', [authMiddleware, validationMiddleware], async (req, res) => {
  try {
    return handleResponse(req, res, 200, {
      success: true,
      data: { games: await getRecommendations({ userObj: req.body.user }) },
    });
  } catch (err) {
    console.log('err', err);
    return handleResponse(req, res, 400, {}, err);
  }
});

router.post(
  '/initialize',
  [
    authMiddleware,
    check('liked_genres')
      .custom((value) => isValidArray(value))
      .customSanitizer((value) => toIntegerArray(value)),
    check('disliked_genres')
      .custom((value) => isValidArray(value))
      .customSanitizer((value) => toIntegerArray(value)),
    validationMiddleware,
  ],
  async (req, res) => {
    try {
      if (_.intersection(req.body.liked_genres, req.body.disliked_genres).length > 0)
        return handleResponse(req, res, 400, {}, 'Liked and Disliked Genres do not agree.');

      if (req.body.liked_genres.length > 5 || req.body.disliked_genres.length > 3)
        return handleResponse(req, res, 400, {}, 'Liked and Disliked Genres overflow.');

      // Pull games from the DB
      const games = await getInitialRecommendations({
        liked_genres: req.body.liked_genres,
        disliked_genres: req.body.disliked_genres,
      });
      if (!games) return handleResponse(req, res, 400, {}, 'No games found for the specified genres.');

      try {
        // Add disliked genres to the user

        return handleResponse(req, res, 200, {
          success: true,
          data: {
            games,
            genres: await updateGenres({ userObj: req.body.user, genreIds: req.body.disliked_genres }),
          },
        });
      } catch (err) {
        console.log(err);
        return handleResponse(req, res, 400, {}, `Updating genres failed with: ${err}`);
      }
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, `Fetching games failed with: ${err}`);
    }
  }
);

module.exports = router;

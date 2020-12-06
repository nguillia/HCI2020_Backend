const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getRecommendations, getInitialRecommendations } = require('../database/utils/recommender');
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
    // authMiddleware,
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

      return handleResponse(req, res, 200, {
        success: true,
        data: {
          games: await getInitialRecommendations({
            liked_genres: req.body.liked_genres,
            disliked_genres: req.body.disliked_genres,
          }),
        },
      });
    } catch (err) {
      console.log('err', err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

module.exports = router;

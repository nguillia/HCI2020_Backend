const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getRecommendations } = require('../database/utils/recommender');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');

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

module.exports = router;

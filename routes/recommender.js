const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getRecommendations } = require('../database/utils/recommender');

router.post('/recommend', async (req, res) => {
  // Insert magic recommender function here.
  return handleResponse(req, res, 200, { success: true, data: await getRecommendations({iUserId: 1}) });
});

module.exports = router;

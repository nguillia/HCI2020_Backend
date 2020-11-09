const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { twitchMiddleware } = require('../services/games/middleware');
const { getRecommendations } = require('../database/utils/recommender');

router.get('/list', [twitchMiddleware], async (req, res) => {
    return handleResponse(req, res, 200, { success: true, data: await getRecommendations({iUserId: 1}) });
});

module.exports = router;
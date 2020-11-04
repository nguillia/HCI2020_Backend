const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { twitchMiddleware } = require('../services/games/middleware');
const { recommenderMiddleware } = require('../services/recommender/middleware');

router.get('/list', [twitchMiddleware, recommenderMiddleware], (req, res) => {
    return handleResponse(req, res, 200, { success: true });
});

module.exports = router;
const router = require('express').Router();
const axios = require('axios');
const { handleResponse } = require('../services/utils');
const { twitchMiddleware } = require('../services/games/middleware');

// Get the list of users - Test route
router.get('/games/list', twitchMiddleware, (req, res) => {
  const options = {
    method: 'POST',
    url: 'https://api.igdb.com/v4/games',
    headers: {
      'Client-ID': req.headers['Client-ID'],
      Authorization: req.headers['Authorization'],
    },
  };

  axios(options)
    .then((response) => {
      return handleResponse(req, res, 200, { success: true, games: response.data });
    })
    .catch((error) => {
      return handleResponse(req, res, 401);
    });
});

module.exports = router;

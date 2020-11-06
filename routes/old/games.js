const router = require('express').Router();
const axios = require('axios');
const { handleResponse } = require('../../services/utils');
const { twitchMiddleware } = require('../../services/games/middleware');

axios.defaults.method = 'POST';
axios.defaults.baseURL = process.env.BASE_URL;
axios.defaults.headers.common['Client-ID'] = process.env.TWITCH_CLIENT_ID;

/**
 * Get a list containing 10 games (by ID).
 */
router.get('/list', twitchMiddleware, (req, res) => {
  const options = {
    url: 'games',
    headers: {
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

router.get('/genres', twitchMiddleware, (req, res) => {
  const options = {
    url: 'genres',
    headers: {
      Authorization: req.headers['Authorization'],
    },
    data: 'fields name,slug;',
  };

  axios(options)
    .then((response) => {
      return handleResponse(req, res, 200, { success: true, genres: response.data });
    })
    .catch((error) => {
      return handleResponse(req, res, 401);
    });
});

module.exports = router;

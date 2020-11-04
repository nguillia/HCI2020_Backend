const router = require('express').Router();
const axios = require('axios');
const { handleResponse } = require('../services/utils');
const { twitchMiddleware } = require('../services/games/middleware');

/**
 * Get a list containing 10 games (by ID).
 */
router.get('/list', twitchMiddleware, (req, res) => {
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

router.get('/artworks', twitchMiddleware, (req, res) => {
  const options = {
    method: 'POST',
    url: 'https://api.igdb.com/v4/artworks',
    headers: {
      'Client-ID': req.headers['Client-ID'],
      Authorization: req.headers['Authorization'],
    },
    data: 'fields alpha_channel,animated,checksum,game,height,image_id,url,width;',
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
    method: 'POST',
    url: 'https://api.igdb.com/v4/genres',
    headers: {
      'Client-ID': req.headers['Client-ID'],
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

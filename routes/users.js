const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getUserInfo } = require('../database/utils/users');
const { getGenres } = require('../database/utils/genres');
const { getGamesWithIds } = require('../database/utils/games');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { check } = require('express-validator');
const _ = require('lodash');
const { Game } = require('../database/init');

router.post('/user', [check('id').toInt().isInt().not().isEmpty(), validationMiddleware], async (req, res) => {
  try {
    const user = await getUserInfo({ id: req.body.id });
    if (user) return handleResponse(req, res, 200, { success: true, data: user });
    else return handleResponse(req, res, 400, {}, 'User not found.');
  } catch (err) {
    return handleResponse(req, res, 400, {}, err);
  }
});

router.post(
  '/like_genres',
  [check('id').toInt().isInt().not().isEmpty(), check('genres').not().isEmpty(), validationMiddleware],
  async (req, res) => {
    try {
      if (req.body.genres.length < 1) return handleResponse(req, res, 400, {}, 'No genres passed.');

      const user = await getUserInfo({ id: req.body.id });
      const genres = await getGenres();

      if (user && genres) {
        let genreCounter = 0;

        req.body.genres.forEach((id) => {
          const genreId = parseInt(id);

          if (!isNaN(genreId)) {
            const genre = _.filter(genres, (g) => {
              return g.id === genreId;
            })[0];

            try {
              user.addGenre(genre, { through: { liked: 1 } });
              genreCounter += 1;
            } catch (err) {
              console.log(`Genre ${genreId} not added to user.`);
            }
          }
        });

        if (genreCounter === req.body.genres.length)
          return handleResponse(req, res, 200, { success: true, data: { added: genreCounter } });
        else
          return handleResponse(req, res, 400, {}, `Only ${genreCounter} of ${req.body.genres.length} genres added.`);
      } else return handleResponse(req, res, 400, {}, 'User not found.');
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

router.post(
  '/like_games',
  [check('id').toInt().isInt().not().isEmpty(), check('games').not().isEmpty(), validationMiddleware],
  async (req, res) => {
    try {
      if (req.body.games.length < 1) return handleResponse(req, res, 400, {}, 'No games passed.');

      const gameIds = _.filter(
        _.map(req.body.games, (g) => {
          return parseInt(g);
        }),
        (g) => !isNaN(g)
      );

      const user = await getUserInfo({ id: req.body.id });
      const games = await getGamesWithIds({
        ids: gameIds,
      });

      if (user && games && games.length > 0) {
        let gameCounter = 0;

        gameIds.forEach((id) => {
          const game = _.filter(games, (g) => {
            return g.id === id;
          })[0];
          if (game) {
            try {
              user.addGame(game);
              gameCounter += 1;
            } catch (err) {
              console.log(`Game ${gameId} not added to user.`);
            }
          }
        });

        if (gameCounter === req.body.games.length)
          return handleResponse(req, res, 200, { success: true, data: { added: gameCounter } });
        else return handleResponse(req, res, 400, {}, `Only ${gameCounter} of ${req.body.games.length} games added.`);
      } else return handleResponse(req, res, 400, {}, 'User not found.');
    } catch (err) {
      console.log(err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

module.exports = router;

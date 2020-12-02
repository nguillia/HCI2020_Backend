const Sequelize = require('sequelize');
const { sequelize, User, Game, Genre } = require('../init');
const { getGenres } = require('../utils/genres');
const { getGamesWithIds } = require('../utils/games');
const _ = require('lodash');
const { reject } = require('lodash');

const getUserInfo = ({ id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await User.findOne({ where: { id: id }, attributes: ['id'], include: [{ model: Game }, { model: Genre }] })
      );
    } catch (err) {
      reject(err);
    }
  });
};

const dislikeGenres = ({ userId, genres }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const output = { success: [], error: [] };
      const userObj = await getUserInfo({ id: userId });
      const genresObj = await getGenres();

      if (userObj && genresObj && genresObj.length > 0) {
        genres.forEach((id) => {
          const genreId = parseInt(id);

          if (!isNaN(genreId)) {
            const genreObj = _.filter(genresObj, (g) => {
              return g.id === genreId;
            })[0];

            if (!genreObj) output.error.push({ genreId });
            else {
              try {
                userObj.addGenre(genreObj);
                output.success.push({ genreId });
              } catch (err) {
                output.error.push({ genreId });
                console.log(`Genre ${genreId} not added to user.`);
              }
            }
          }
        });
        resolve(output);
      } else reject('User not found.');
    } catch (err) {
      resolve(err);
    }
  });
};

const likeDislikeGames = ({ userId, games, like }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gameIds = _.filter(
        _.map(games, (g) => {
          return parseInt(g);
        }),
        (g) => !isNaN(g)
      );

      const output = { success: [], error: [] };
      const userObj = await getUserInfo({ id: userId });
      const gamesObjs = await getGamesWithIds({
        ids: gameIds,
      });

      if (userObj && gamesObjs && gamesObjs.length > 0) {
        gameIds.forEach((gameId) => {
          const gameObj = _.filter(gamesObjs, (g) => {
            return g.id === gameId;
          })[0];

          if (!gameObj) output.error.push({ gameId });
          else {
            try {
              userObj.addGame(gameObj, { through: { liked: like } });
              output.success.push({ gameId });
            } catch (err) {
              output.error.push({ gameId });
              console.log(`Game ${gameId} not added to user.`);
            }
          }
        });

        resolve(output);
      }
      reject('User not found.');
    } catch (err) {
      reject(err);
    }
  });
};

const removeUserGenreLink = ({ userId, genreId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ where: { id: userId } });
      const genre = await Genre.findOne({ where: { id: genreId } });
      if (user && genre) resolve(await user.removeGenre(genre));
      reject('User and/or Genre not found.');
    } catch (err) {
      reject(err);
    }
  });
};

const removeUserGameLink = () => {};

module.exports = { getUserInfo, dislikeGenres, likeDislikeGames, removeUserGameLink, removeUserGenreLink };

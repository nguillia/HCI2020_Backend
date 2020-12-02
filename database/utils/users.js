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

const updateGenres = ({ userId, genreIds }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const output = { success: [], error: [] };
      const userObj = await getUserInfo({ id: userId });
      const genresObj = await getGenres();

      if (userObj && genresObj && genresObj.length > 0) {
        genresObj.forEach((genreObj) => {
          console.log(genreObj.id);
          if (genreIds.includes(genreObj.id)) {
            // Dislike the genre
            try {
              userObj.addGenre(genreObj);
              output.success.push({ genreId: genreObj.id, disliked: true });
            } catch (err) {
              output.error.push({ genreId: genreObj.id });
              console.log(`Genre ${genreObj.id} not added to user.`, err);
            }
          } else {
            // Like the genre
            try {
              userObj.removeGenre(genreObj);
              output.success.push({ genreId: genreObj.id, disliked: false });
            } catch (err) {
              output.error.push({ genreId: genreObj.id });
              console.log(`Genre ${genreObj.id} not added to user.`, err);
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

const likeDislikeGames = ({ userId, gameIds, like }) => {
  return new Promise(async (resolve, reject) => {
    try {
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

const removeUserGamesLink = ({ userId, gameIds }) => {
  return new Promise(async (resolve, reject) => {
    try {
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
              userObj.removeGame(gameObj);
              output.success.push({ gameId });
            } catch (err) {
              output.error.push({ gameId });
              console.log(`Game ${gameId} not removed from user.`);
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

module.exports = { getUserInfo, updateGenres, likeDislikeGames, removeUserGamesLink };

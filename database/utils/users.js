const Sequelize = require('sequelize');
const { sequelize, User, Game, Genre, Screenshot, Video, Gamemode, Platform } = require('../init');
const { getGenres } = require('../utils/genres');
const { getGamesWithIds } = require('../utils/games');
const _ = require('lodash');

const getUser = ({ id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await User.findOne({ where: { id: id }, attributes: ['id', 'username'] }));
    } catch (err) {
      reject(err);
    }
  });
};

const getUserByUsername = ({ username }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await User.findOne({ where: { username }, attributes: ['id', 'username', 'password'] }));
    } catch (err) {
      reject(err);
    }
  });
};

const getUserInfo = ({ id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await User.findOne({
          where: { id: id },
          attributes: ['id', 'username'],
          include: [
            {
              model: Game,
              include: [
                { model: Screenshot, attributes: ['screenshot_id'] },
                { model: Genre, attributes: ['name'] },
                // { model: Video },
                // { model: Platform },
                // { model: Gamemode },
              ],
              attributes: ['id', 'name', 'cover_id'],
            },
            { model: Genre, attributes: ['name'] },
          ],
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

const updateGenres = ({ userObj, genreIds }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const output = { success: [], error: [] };
      const genresObj = await getGenres();

      if (genresObj && genresObj.length > 0) {
        genresObj.forEach((genreObj) => {
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
      } else reject('Genres not found.');
    } catch (err) {
      resolve(err);
    }
  });
};

const likeDislikeGames = ({ userObj, gameIds, like }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const output = { success: [], error: [] };
      const gamesObjs = await getGamesWithIds({
        ids: gameIds,
      });

      if (gamesObjs && gamesObjs.length > 0) {
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
              console.log(err);
              output.error.push({ gameId });
              console.log(`Game ${gameId} not added to user.`);
            }
          }
        });

        resolve(output);
      }
      reject('Games not found.');
    } catch (err) {
      reject(err);
    }
  });
};

const removeUserGamesLink = ({ userObj, gameIds }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const output = { success: [], error: [] };
      const gamesObjs = await getGamesWithIds({
        ids: gameIds,
      });

      if (gamesObjs && gamesObjs.length > 0) {
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
      reject('Games not found.');
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { getUser, getUserByUsername, getUserInfo, updateGenres, likeDislikeGames, removeUserGamesLink };

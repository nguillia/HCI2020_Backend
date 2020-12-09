const Sequelize = require('sequelize');
const { getGames, getGamesGenres } = require('./games');
const _ = require('lodash');

const getRecommendations = ({ userObj }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(userObj);
      const gamesObjs = await getGames();
      const recommendedGameIds = _.map(await userObj.getGames(), (game) => game.id);

      const newGamesObjs = _.filter(gamesObjs, (game) => {
        return !recommendedGameIds.includes(game.id);
      });

      // Insert magic recommender function here
      resolve(_.slice(_.shuffle(newGamesObjs), 0, 10));
    } catch (error) {
      reject(error);
    }
  });
};

const getInitialRecommendations = (genres) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await getGamesGenres(genres));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getRecommendations, getInitialRecommendations };

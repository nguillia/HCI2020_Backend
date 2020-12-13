const Sequelize = require('sequelize');
const { getGames, getGamesGenres, getGamesWithout } = require('./games');
const _ = require('lodash');

const getRecommendations = ({ userObj }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const recommendedGameIds = _.map(await userObj.getGames(), (game) => game.id);
      const games = await getGamesWithout({ excluded: recommendedGameIds });

      // Insert magic recommender function here
      resolve(_.slice(_.shuffle(games), 0, 10));
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

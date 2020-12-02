const Sequelize = require('sequelize');
const { Game_Genre, User_Likedgame, User } = require('../init');
const { getGames } = require('./games');
const _ = require('lodash');

const getRecommendations = ({ userObj }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(userObj);
      const gamesObjs = await getGames(10);
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

module.exports = { getRecommendations };

const Sequelize = require('sequelize');
const { Game_Genre, User_Likedgame, User } = require('../init');
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

const getInitialRecommendations = ({ liked_genres, disliked_genres }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('ID List', disliked_genres);
      const gamesObjs = await getGamesGenres({ liked_genres, disliked_genres });
      console.log(gamesObjs);

      // Insert magic recommender function here
      resolve(gamesObjs);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getRecommendations, getInitialRecommendations };

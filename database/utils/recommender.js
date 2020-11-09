const Sequelize = require('sequelize');
const { sequelize, Game, Genre, User_Likedgames, Gamemode } = require('../init');
const _ = require('lodash');

const getRecommendations = ({ iUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const likedGames = await User_Likedgames.findAll( {
        where: {
          userId: iUserId
        }
      })  
      console.log(likedGames);
      resolve(likedGames);
    }catch (error) {
      reject(error);
    }
  });
};

module.exports = { getRecommendations };

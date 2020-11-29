const Sequelize = require('sequelize');
const { Game_Genre, User_Likedgame, User } = require('../init');
const _ = require('lodash');

const getRecommendations = ({ iUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        where: {
          id: iUserId,
        },
      });
      const likedGames = await user.getGames();
      const likedGenresPromise = async () => {
        return Promise.all(likedGames.map((g) => g.getGenres()));
      };
      likedGenresPromise().then((data) => {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getRecommendations2 = ({ iUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const likedGames = await User_Likedgames.findAll({
        where: {
          userId: iUserId,
        },
      });
      console.log(likedGames);
      resolve(likedGames);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getRecommendations };

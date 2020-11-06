const Sequelize = require('sequelize');
const { sequelize, Game, Genre } = require('../init');

const getGames = () => {
  return new Promise((resolve, reject) => {
    Game.findAll({ include: [{ model: Genre, include: [{ association: 'Genre_Game' }] }] })
      .then((games) => resolve(games))
      .catch((err) => reject(err));

    // Game.findOne({ where: { id: 31 } })
    //   .then((game) => {
    //     game
    //       .getGenres()
    //       .then((g) => console.log('Genre', g))
    //       .catch((err) => console.log(err));
    //   })
    //   .catch((err) => console.log(err));
  });
};

module.exports = { getGames };

const Sequelize = require('sequelize');

const Game = {
    name: 'game',
    attributes: {
      name: {
            type: Sequelize.STRING,
            allowNull: false,
      },
      first_release_date: {
        type: Sequelize.DATE,
        allowNull: true,
        unique: false,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: false,
      },
      total_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: false,
      },
      aggregated_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: false,
      },
      summary: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      cover_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      followers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
      },
    },
    options: {},
  };
  
  module.exports = Game;
  
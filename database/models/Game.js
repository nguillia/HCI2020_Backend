const Sequelize = require('sequelize');

const Game = {
  name: 'game',
  attributes: {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    first_release_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    aggregated_rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    summary: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cover_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    followers: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  options: {},
};

module.exports = Game;

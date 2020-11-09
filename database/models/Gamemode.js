const Sequelize = require('sequelize');

const GameMode = {
    name: 'gamemode',
    attributes: {
      name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false,
      },
    },
    options: {},
  };
  
  module.exports = GameMode;
  
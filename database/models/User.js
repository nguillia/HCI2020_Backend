const Sequelize = require('sequelize');

const User = {
    name: 'user',
    attributes: {
      username: {
            type: Sequelize.STRING,
            allowNull: false,
      },
      password: {
            type: Sequelize.STRING,
            allowNull: false,
      }
    },
    options: {},
  };
  
  module.exports = User;
  
const Sequelize = require('sequelize');

const Platform = {
    name: 'platform',
    attributes: {
      name: {
            type: Sequelize.STRING,
            allowNull: false,
      },
    },
    options: {},
  };
  
  module.exports = Platform;
  
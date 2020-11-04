const Sequelize = require('sequelize');

const Genre = {
    name: 'genre',
    attributes: {
      name: {
            type: Sequelize.STRING,
            allowNull: false,
      },
    },
    options: {},
  };
  
  module.exports = Genre;
  
const Sequelize = require('sequelize');

const Screenshot = {
    name: 'screenshot',
    attributes: {
        screenshot_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
      },
    },
    options: {},
  };
  
  module.exports = Screenshot;
  
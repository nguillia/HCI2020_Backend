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
    },
    system: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  options: {},
};

module.exports = User;

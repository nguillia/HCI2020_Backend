const Sequelize = require('sequelize');

const Session = {
  name: 'session',
  attributes: {
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  options: {},
};

module.exports = Session;

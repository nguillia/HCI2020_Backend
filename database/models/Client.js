const Sequelize = require('sequelize');

const Client = {
  name: 'client',
  attributes: {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    mail: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    latestUpdate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  options: {},
};

module.exports = Client;

const Sequelize = require('sequelize');
const { sequelize, User, Game, Genre } = require('../init');
const _ = require('lodash');

const getUserInfo = ({ id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await User.findOne({ where: { id: id }, attributes: ['id'], include: [{ model: Game }, { model: Genre }] })
      );
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { getUserInfo };

const Sequelize = require('sequelize');
const { sequelize, Game, Genre, Platform, Gamemode } = require('../init');
const _ = require('lodash');

const getGames = ({ limit }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          ...(limit && { limit }),
          include: [{ model: Genre }, { model: Platform }, { model: Gamemode }],
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { getGames };

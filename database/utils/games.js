const Sequelize = require('sequelize');
const { sequelize, Game, Genre, Platform, Gamemode, Screenshot, Video } = require('../init');
const _ = require('lodash');

const getGames = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          ...(limit && { limit }),
          include: [
            { model: Genre },
            { model: Platform },
            { model: Gamemode },
            { model: Screenshot },
            { model: Video },
          ],
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

const getGamesWithIds = ({ ids }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          where: {
            id: { [Sequelize.Op.or]: ids },
          },
          include: [
            { model: Genre },
            { model: Platform },
            { model: Gamemode },
            { model: Screenshot },
            { model: Video },
          ],
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

const getGamesWithoutGenres = ({ ids }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          include: [
            { model: Genre, where: { id: { [Sequelize.Op.notIn]: ids } } },
            { model: Platform },
            { model: Gamemode },
            { model: Screenshot },
            { model: Video },
          ],
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { getGames, getGamesWithIds, getGamesWithoutGenres };

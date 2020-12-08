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

const getGamesGenres = ({ liked_genres, disliked_genres }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          include: [
            {
              model: Genre,
              where: {
                [Sequelize.Op.and]: [
                  { id: { [Sequelize.Op.notIn]: disliked_genres } },
                  { id: { [Sequelize.Op.in]: liked_genres } },
                ],
              },
            },
            { model: Platform },
            { model: Gamemode },
            { model: Screenshot },
            { model: Video },
          ],
          order: [['followers', 'DESC']],
          limit: 10,
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { getGames, getGamesWithIds, getGamesGenres };

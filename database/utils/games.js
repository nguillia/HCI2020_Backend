const Sequelize = require('sequelize');
const { sequelize, Game, Genre, Platform, Gamemode, Screenshot, Video } = require('../init');
const _ = require('lodash');
const { attributes } = require('../models/Game');

const getGames = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          include: [
            { model: Genre, attributes: ['name'] },
            { model: Platform, attributes: ['id'] },
            { model: Screenshot, attributes: ['screenshot_id'] },
            { model: Video, attributes: ['video_id'] },
          ],
          attributes: ['id', 'name', 'summary', 'rating', 'aggregated_rating'],
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

const getGamesWithId = ({ id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findOne({
          where: {
            id: id,
          },
          include: [
            { model: Genre, attributes: ['name'] },
            { model: Platform, attributes: ['id'] },
            { model: Screenshot, attributes: ['screenshot_id'] },
            { model: Video, attributes: ['video_id'] },
          ],
          attributes: ['id', 'name', 'summary', 'rating', 'aggregated_rating'],
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
            id: { [Sequelize.Op.in]: ids },
          },
          include: [
            { model: Genre, attributes: ['name'] },
            { model: Platform, attributes: ['id'] },
            { model: Screenshot, attributes: ['screenshot_id'] },
            { model: Video, attributes: ['video_id'] },
          ],
          attributes: ['id', 'name', 'summary', 'rating', 'aggregated_rating'],
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
      const recommendations = _.map(
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
          ],
          order: [['followers', 'DESC']],
          limit: 10,
          attributes: ['id', 'followers'],
        }),
        ({ id }) => id
      );

      if (recommendations.length < 10) {
        const others = _.map(
          await Game.findAll({
            include: [
              {
                model: Genre,
                where: {
                  [Sequelize.Op.and]: [{ id: { [Sequelize.Op.notIn]: disliked_genres } }],
                },
              },
            ],
            where: {
              id: { [Sequelize.Op.notIn]: recommendations },
            },
            order: [['followers', 'DESC']],
            limit: 10 - recommendations.length,
            attributes: ['id', 'followers'],
          }),
          ({ id }) => id
        );
        resolve(await getGamesWithIds({ ids: _.concat(recommendations, others) }));
      } else resolve(await getGamesWithIds({ ids: recommendations }));
    } catch (err) {
      reject(err);
    }
  });
};

const getGamesWithout = ({ excluded }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          include: [
            {
              model: Genre,
              where: {
                id: { [Sequelize.Op.notIn]: excluded },
              },
            },
          ],
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

const getGamesWithoutGenresRecommended = ({ excludedGenres, excludedGames }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          where: {
            id: { [Sequelize.Op.notIn]: excludedGames },
          },
          include: [
            {
              model: Genre,
              where: {
                id: { [Sequelize.Op.notIn]: excludedGenres },
              },
            },
          ],
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  getGames,
  getGamesWithId,
  getGamesWithIds,
  getGamesGenres,
  getGamesWithout,
  getGamesWithoutGenresRecommended,
};

const Sequelize = require('sequelize');
const { sequelize, Game, Genre, Platform, Gamemode, Screenshot, Video } = require('../init');
const _ = require('lodash');
const { attributes } = require('./attributes');

const getGames = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          include: [
            { model: Genre, attributes: attributes.genre },
            { model: Platform, attributes: attributes.platform },
            { model: Screenshot, attributes: attributes.screenshot },
            { model: Video, attributes: attributes.video },
          ],
          attributes: attributes.game,
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
            { model: Genre, attributes: attributes.genre },
            { model: Platform, attributes: attributes.platform },
            { model: Screenshot, attributes: attributes.screenshot },
            { model: Video, attributes: attributes.video },
          ],
          attributes: attributes.game,
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
            { model: Genre, attributes: attributes.genre },
            { model: Platform, attributes: attributes.platform },
            { model: Screenshot, attributes: attributes.screenshot },
            { model: Video, attributes: attributes.video },
          ],
          attributes: attributes.game,
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};

const getRandomGames = ({ excluded }) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await Game.findAll({
          where: {
            id: { [Sequelize.Op.notIn]: excluded },
          },
          include: [
            { model: Genre, attributes: attributes.genre },
            { model: Platform, attributes: attributes.platform },
            { model: Screenshot, attributes: attributes.screenshot },
            { model: Video, attributes: attributes.video },
          ],
          attributes: attributes.game,
          order: Sequelize.literal('rand()'),
          limit: 5,
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
          // order: [['followers', 'DESC']],
          where: { followers: { [Sequelize.Op.gte]: 50 } },
          attributes: ['id', 'followers'],
          order: Sequelize.literal('rand()'),
          limit: 10,
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
              attributes: attributes.genre,
            },
          ],
          attributes: attributes.game,
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
              attributes: attributes.genre,
            },
          ],
          attributes: attributes.game,
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
  getRandomGames,
};

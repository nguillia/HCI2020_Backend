const { reject } = require('lodash');
const Sequelize = require('sequelize');
const { sequelize, Genre } = require('../init');

const getGenres = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await Genre.findAll());
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { getGenres };

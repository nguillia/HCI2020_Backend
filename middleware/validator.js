const _ = require('lodash');
const { User } = require('../database/init');

const isUser = async (id, req) => {
  const user = await User.findOne({ where: { id: id }, attributes: ['id', 'username'] });
  if (user) {
    req.body.user = user;
    return true;
  }
  return Promise.reject(`User with ID ${id} not found.`);
};

const isValidArray = (array) => {
  // if (Array.isArray(array) && array.length > 0) return true;
  if (Array.isArray(array)) return true;
  return Promise.reject('Invalid Array.');
};

const toIntegerArray = (array) => {
  return _.filter(
    _.map(array, (value) => {
      return parseInt(value.trim());
    }),
    (value) => !isNaN(value)
  );
};

module.exports = {
  isUser,
  isValidArray,
  toIntegerArray,
};

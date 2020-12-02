const _ = require('lodash');

const isValidArray = (array) => {
  if (Array.isArray(array) && array.length > 0) return true;
  return Promise.reject('Invalid Array.');
};

const toIntegerArray = (array) => {
  return _.filter(
    _.map(array, (value) => {
      return parseInt(value);
    }),
    (value) => !isNaN(value)
  );
};

module.exports = {
  isValidArray,
  toIntegerArray,
};

const { handleResponse } = require('../utils');
const axios = require('axios');


const recommenderMiddleware = async (req, res, next) => {
    
    next();
};

  


module.exports = {
    recommenderMiddleware,
};
  
module.exports = (app) => {
  app.use('', require('./games'));

  console.log('Routes registered.');
};

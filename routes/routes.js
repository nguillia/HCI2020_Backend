module.exports = (app) => {
  app.use('/api/games', require('./games'));

  console.log('Routes registered.');
};

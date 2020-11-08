module.exports = (app) => {
  app.use('/api/games', require('./games'));
  app.use('/api/recommender', require('./recommender'));

  console.log('Routes registered.');
};

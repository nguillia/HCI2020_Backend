module.exports = (app) => {
  app.use('/api/games', require('./old/games'));
  app.use('/api/recommender', require('./recommender'));

  console.log('Routes registered.');
};

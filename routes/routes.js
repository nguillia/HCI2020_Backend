module.exports = (app) => {
  app.use('/api/games', require('./games'));
  app.use('/api/genres', require('./genres'));
  app.use('/api/users', require('./users'));
  app.use('/api/recommender', require('./recommender'));

  console.log('Routes registered.');
};

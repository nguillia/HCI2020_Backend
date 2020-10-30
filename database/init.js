const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
});

const init = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection had been established.');

      require('./relations');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
};

module.exports.init = init;
module.exports.sequelize = sequelize;
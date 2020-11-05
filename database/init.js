const Sequelize = require('sequelize');

const GameSchema = require('./models/Game');
const GameModeSchema = require('./models/GameMode');
const GenreSchema = require('./models/Genre');
const PlatformSchema = require('./models/Platform');
const ScreenshotSchema = require('./models/Screenshot');
const VideoSchema = require('./models/Video');

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

module.exports.Game = sequelize.define(GameSchema.name, GameSchema.attributes, GameSchema.options);
module.exports.GameMode = sequelize.define(GameModeSchema.name, GameModeSchema.attributes, GameModeSchema.options);
module.exports.Genre = sequelize.define(GenreSchema.name, GenreSchema.attributes, GenreSchema.options);
module.exports.Platform = sequelize.define(PlatformSchema.name, PlatformSchema.attributes, PlatformSchema.options);
module.exports.Screenshot = sequelize.define(
  ScreenshotSchema.name,
  ScreenshotSchema.attributes,
  ScreenshotSchema.options
);
module.exports.Video = sequelize.define(VideoSchema.name, VideoSchema.attributes, VideoSchema.options);

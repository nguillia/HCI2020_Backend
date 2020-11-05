const { sequelize } = require('./init');
const Game = require('./models/Game');
const GameMode = require('./models/GameMode');
const Genre = require('./models/Genre');
const Platform = require('./models/Platform');
const Screenshot = require('./models/Screenshot');
const Video = require('./models/Video');

const GameAssoc = sequelize.define('game', Game.attributes);
const GenreAssoc = sequelize.define('genre', Genre.attributes);
const PlatformAssoc = sequelize.define('platform', Platform.attributes);
const ScreenshotAssoc = sequelize.define('screenshot', Screenshot.attributes);
const GameModeAssoc = sequelize.define('gamemode', GameMode.attributes);
const VideoAssoc = sequelize.define('video', Video.attributes);

// Game-Genre M:N
GameAssoc.belongsToMany(GenreAssoc, {through: 'Game_Genre'});
GenreAssoc.belongsToMany(GameAssoc, {through: 'Game_Genre'});
// Game-Platforms M:N
GameAssoc.belongsToMany(PlatformAssoc, {through: 'Game_Platform'});
PlatformAssoc.belongsToMany(GameAssoc, {through: 'Game_Platform'});
// Game-Screenshots 1:N
GameAssoc.hasMany(ScreenshotAssoc);
ScreenshotAssoc.belongsTo(GameAssoc);
// Game-Modes M:N
GameAssoc.belongsToMany(GameModeAssoc, {through: 'Game_GameMode'});
GameModeAssoc.belongsToMany(GameAssoc, {through: 'Game_GameMode'});
// Game-Videos 1:N
GameAssoc.hasMany(VideoAssoc);
VideoAssoc.belongsTo(GameAssoc);

console.log('DB Relations added.');

// Client.hasOne(Domain);

// Client.hasOne(Hosting);
// Domain.hasOne(Hosting);
// HostingType.hasOne(Hosting);

// Sync
sequelize.sync();
console.log('DB Synced.');

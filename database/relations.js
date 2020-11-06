const { sequelize, Game, Video, Screenshot, GameMode, Genre, Platform } = require('./init');

// Game-Genre M:N
Game.belongsToMany(Genre, { through: 'Genre_Game' });
// Genre.belongsToMany(Game, { through: 'Game_Genre' });
// Game-Platforms M:N
// Game.belongsToMany(Platform, { through: 'Game_Platform' });
Platform.belongsToMany(Game, { through: 'Game_Platform' });
// Game-Screenshots 1:N
Game.hasMany(Screenshot);
Screenshot.belongsTo(Game);
// Game-Modes M:N
// Game.belongsToMany(GameMode, { through: 'Game_GameMode' });
GameMode.belongsToMany(Game, { through: 'Game_GameMode' });
// Game-Videos 1:N
Game.hasMany(Video);
Video.belongsTo(Game);

console.log('DB Relations added.');

// Sync
// sequelize.sync();
// console.log('DB Synced.');

const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');

const { Platform, Screenshot, GameMode, Game, Video, Genre } = require('../database/init');

/**
 * Populate the database and parse the game data.
 */
const pullGames = async () => {
  const games = loadData('./games');

  // createGames(games)
  //   .then((i) => console.log(`${i.length} Games added.`))
  //   .catch((err) => console.log(err));

  // createGenres(games)
  //   .then((i) => console.log(`${i.length} Genres added.`))
  //   .catch((err) => console.log(err));

  // createGameModes(games)
  //   .then((i) => console.log(`${i.length} Gamemodes added.`))
  //   .catch((err) => console.log(err));

  // const i = 0;
  // createScreenshots(games, i * 1000, (i + 1) * 1000)
  //   .then((c) => console.log(`${c} Screenshots added.`))
  //   .catch((err) => console.log(err));

  // const i = 0;
  // createVideos(games, i * 1000, (i + 1) * 1000)
  //   .then((c) => console.log(`${c} Videos added.`))
  //   .catch((err) => console.log(err));

  // connectGametoGameMode(games)
  //   .then(() => console.log('ok'))
  //   .catch((err) => console.log(err));

  // connectGametoGenre(games)
  //   .then(() => console.log('ok'))
  //   .catch((err) => console.log(err));

  // connectGametoPlatform(games)
  //   .then(() => console.log('ok'))
  //   .catch((err) => console.log(err));
};

/**
 * Insert the games into the database.
 * @param {array} games The array containing the games and all their data.
 */
const createGames = async (games) => {
  const newGames = _.map(games, (game) => {
    return {
      name: game.name,
      first_release_date: game.first_release_date,
      rating: game.rating ? parseInt(game.rating) : null,
      total_rating: game.total_rating ? parseInt(game.total_rating) : null,
      aggregated_rating: game.aggregated_rating ? parseInt(game.aggregated_rating) : null,
      summary: game.summary,
      cover_id: game.cover ? game.cover.image_id : null,
      followers: game.follows ? game.follows : 0,
    };
  });

  console.log(`There are ${newGames.length} game modes.`);
  return Promise.all([Game.bulkCreate(newGames)]);
};

/**
 * Insert the gamemodes into the database.
 * @param {array} games The array containing all games and their corresponding gamemodes.
 */
const createGameModes = async (games) => {
  const gameModes = _.map(
    _.filter(
      _.uniqBy(
        _.flatten(
          _.map(games, (game) => {
            return game.game_modes;
          })
        ),
        'id'
      ),
      (item) => item !== undefined
    ),
    ({ name }) => {
      return { name: name };
    }
  );
  console.log(`There are ${gameModes.length} game modes.`);
  return Promise.all([GameMode.bulkCreate(gameModes)]);
};

/**
 * Insert the genres into the database.
 * @param {array} games The array containging games and their corresponding genres.
 */
const createGenres = async (games) => {
  const genres = _.map(
    _.filter(
      _.uniqBy(
        _.flatten(
          _.map(games, (game) => {
            return game.genres;
          })
        ),
        'id'
      ),
      (item) => item !== undefined
    ),
    ({ name }) => {
      return { name: name };
    }
  );
  console.log(`There are ${genres.length} game modes.`);
  return Promise.all([Genre.bulkCreate(genres)]);
};

/**
 * Insert the selected screenshots into the database.
 * @param {array} games The array containing all games and their corresponding screenshots.
 * @param {integer} start The start of the game list for splitting.
 * @param {integer} end The end of the game list for splitting.
 */
const createScreenshots = async (games, start, end) => {
  const screenshots = _.filter(
    _.map(games, (game) => {
      return { game: game.name, screenshots: game.screenshots };
    }),
    (item) => item.screenshots !== undefined
  ).slice(start, end);

  return new Promise((resolve, reject) => {
    screenshots.forEach(({ game, screenshots: list }) => {
      createSubScreens(game, list)
        .then(() => resolve(count))
        .catch((err) => reject(err));
    });
  });
};

/**
 * Create screenshots for a specific game.
 * @param {object} game The game the screenshots belong to.
 * @param {array} list The list containing the screenshots.
 */
const createSubScreens = (game, list) => {
  return new Promise((resolve, reject) => {
    Game.findOne({ where: { name: game } })
      .then((gameObj) => {
        list.forEach((s) => {
          Screenshot.create({ screenshot_id: s.image_id })
            .then((obj) => {
              obj
                .setGame(gameObj)
                .then(() => resolve(true))
                .catch(reject(false));
            })
            .catch(() => reject(false));
        });
      })
      .catch((err) => console.log(err));
  });
};

/**
 * Insert the selected videos into the database.
 * @param {array} games The array containing all games and their corresponsing videos.
 * @param {integer} start The start of the game list for splitting.
 * @param {integer} end The end of the game list for splitting.
 */
const createVideos = async (games, start, end) => {
  const videos = _.filter(
    _.map(games, (game) => {
      return {
        game: game.name,
        videos: _.filter(game.videos, (v) => {
          return v.name === 'Trailer';
        }),
      };
    }),
    (item) => item.videos !== undefined && item.videos.length > 0
  ).slice(start, end);

  return new Promise((resolve, reject) => {
    videos.forEach(({ game, videos: list }) => {
      createSubVideos(game, list)
        .then(() => resolve(count))
        .catch((err) => reject(err));
    });
  });
};

/**
 * Create videos for a specific game.
 * @param {object} game The game the videos belong to.
 * @param {array} list The list containing the videos.
 */
const createSubVideos = (game, list) => {
  return new Promise((resolve, reject) => {
    Game.findOne({ where: { name: game } })
      .then((gameObj) => {
        list.forEach((s) => {
          Video.create({ video_id: s.video_id })
            .then((obj) => {
              obj
                .setGame(gameObj)
                .then(() => resolve(true))
                .catch(reject(false));
            })
            .catch(() => reject(false));
        });
      })
      .catch((err) => console.log(err));
  });
};

/**
 * Connect both game to gamemode.
 * @param {array} games The array containing all games and their corresponding gamemodes.
 */
const connectGametoGameMode = (games) => {
  const list = _.filter(
    _.map(games, ({ name, game_modes }) => {
      return { name: name, game_modes: game_modes };
    }),
    (item) => item.game_modes !== undefined
  );

  return new Promise((resolve, reject) => {
    list.forEach(({ name, game_modes }) => {
      Game.findOne({ where: { name: name } })
        .then((gameObj) => {
          game_modes.forEach((mode) => {
            GameMode.findOne({ where: { name: mode.name } })
              .then((gameModeObj) => {
                gameModeObj.addGame(gameObj);
                resolve(true);
              })
              .catch((err) => reject(err));
          });
        })
        .catch((err) => reject(err));
    });
  });
};

/**
 * Connect both game to genre.
 * @param {array} games The array containing all games and their corresponding genres.
 */
const connectGametoGenre = (games) => {
  const list = _.filter(
    _.map(games, ({ name, genres }) => {
      return { name: name, genres: genres };
    }),
    (item) => item.genres !== undefined
  );

  return new Promise((resolve, reject) => {
    list.forEach(({ name, genres }) => {
      Game.findOne({ where: { name: name } })
        .then((gameObj) => {
          genres.forEach((genre) => {
            Genre.findOne({ where: { name: genre.name } })
              .then((genreObj) => {
                gameObj.addGenre(genreObj);
                resolve(true);
              })
              .catch((err) => reject(err));
          });
        })
        .catch((err) => reject(err));
    });
  });
};

/**
 * Connect both game to platform.
 * @param {array} games The array containing all games and their corresponding platforms.
 */
const connectGametoPlatform = (games) => {
  const list = _.filter(
    _.map(games, ({ name, platforms }) => {
      return { name: name, platforms: platforms };
    }),
    (item) => item.platforms !== undefined
  );

  return new Promise((resolve, reject) => {
    list.forEach(({ name, platforms }) => {
      Game.findOne({ where: { name: name } })
        .then((gameObj) => {
          platforms.forEach((platform) => {
            Platform.findOne({ where: { name: platform.name } })
              .then((platformObj) => {
                platformObj.addGame(gameObj);
                resolve(true);
              })
              .catch((err) => reject(err));
          });
        })
        .catch((err) => reject(err));
    });
  });
};

/**
 * Sleep the current function with x ms.
 * @param {integer} ms The amount of miliseconds to sleep.
 */
const sleep = (ms) => {
  return new Promise((resolve) => {
    console.log(`Sleeping ${ms}ms.`);
    setTimeout(resolve, ms);
  });
};

/**
 * Store a JSON object in a file.
 * @param {JSON} data The data in JSON format.
 * @param {string} path The path where the file should be created.
 */
const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
};

/**
 * Load the contents of the file under path, and parse them to JSON object.
 * @param {string} path The path where the file is located.
 */
const loadData = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
 * Request the games from the external API.
 * @param {string} token The Twitch authentication token
 * @param {int} offset The offset for the API database. A limit of 500 items is passed.
 */
const getGames = async (token, offset) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `${process.env.BASE_URL}/games`,
      headers: {
        Accept: 'application/json',
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      data: `fields cover.image_id,first_release_date,follows,game_modes.name,genres.name,name,platforms.name,screenshots.image_id,summary,aggregated_rating,rating,total_rating,videos.name,videos.video_id; where platforms=(3, 6, 14) & category=0; limit 500; offset ${offset};`,
    };

    axios(options)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((error) => {
        return reject(null);
      });
  });
};

/**
 * Log into Twitch and get an authentication token.
 */
const getTwitchToken = async () => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    });

    const options = {
      method: 'POST',
      url: 'https://id.twitch.tv/oauth2/token',
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    axios(options)
      .then((response) => {
        if (response.status === 200) {
          if (response.data) resolve(response.data.access_token);
        }
        return null;
      })
      .catch((error) => {
        console.log(error);
        return reject(null);
      });
  });
};

module.exports.pullGames = pullGames;

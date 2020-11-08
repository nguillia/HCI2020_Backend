const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');

const { Platform, Screenshot, Gamemode, Game, Video, Genre } = require('../database/init');
const { resolve } = require('path');

/**
 * Populate the database and parse the game data.
 */
const pullGames = () => {
  const i = 0;
  const amount = 33681;
  // const amount = 10;
  let games = loadData('./games');
  console.log(games[801]);
  games = games.slice(i * amount, (i + 1) * amount);

  amountChecker(games);

  // createGames(games)
  //   .then((i) => console.log(`${i} Games added.`))
  //   .catch((err) => console.log(err));

  // createGenres(games)
  //   .then((i) => console.log(`${i.length} Genres added.`))
  //   .catch((err) => console.log(err));

  // createGamemodes(games)
  //   .then((i) => console.log(`${i.length} Gamemodes added.`))
  //   .catch((err) => console.log(err));

  // createVideos(games)
  //   .then((i) => console.log(i ? 'Videos added.' : 'Videos not added'))
  //   .catch((err) => console.log(err));

  // createScreenshots(games)
  //   .then((i) => console.log(i ? 'Screenshots added.' : 'Screenshots not added'))
  //   .catch((err) => console.log(err));

  // connectVideoToGame(games)
  //   .then((i) => console.log(`${i} Videos added.`))
  //   .catch((err) => console.log(err));

  // connectScreenshotToGame(games)
  //   .then((i) => console.log(`${i} Screenshots added.`))
  //   .catch((err) => console.log(err));

  // connectGamemodeToGame(games)
  //   .then((i) => console.log(`${i} Game-Gamemode relations added.`))
  //   .catch((err) => console.log(err));

  // connectGenreToGame(games)
  //   .then((i) => console.log(`${i} Game-Genre relations added.`))
  //   .catch((err) => console.log(err));

  // connectPlatformToGame(games)
  //   .then((i) => console.log(`${i} Game-Platform relations added.`))
  //   .catch((err) => console.log(err));
};

const amountChecker = (games) => {
  const gamemodes = _.uniqBy(
    _.flatten(
      _.map(
        _.filter(games, (game) => game.game_modes !== undefined && game.game_modes.length > 0),
        (game) => {
          return game.game_modes;
        }
      )
    ),
    'id'
  );
  const genres = _.uniqBy(
    _.flatten(
      _.map(
        _.filter(games, (game) => game.genres !== undefined && game.genres.length > 0),
        (game) => {
          return game.genres;
        }
      )
    ),
    'id'
  );
  const gamesWGenre = _.filter(games, (game) => game.genres !== undefined && game.genres.length > 0);
  const screenshots = _.uniqBy(
    _.flatten(
      _.map(
        _.filter(games, (game) => game.screenshots !== undefined && game.screenshots.length > 0),
        (game) => {
          return game.screenshots;
        }
      )
    ),
    'image_id'
  );
  const videos = _.filter(
    _.uniqBy(
      _.flatten(
        _.map(
          _.filter(games, (game) => game.videos !== undefined && game.videos.length > 0),
          (game) => {
            return game.videos;
          }
        )
      ),
      'video_id'
    ),
    (video) => video.name === 'Trailer'
  );

  // Combinations
  const genresRecords = _.flatten(
    _.map(
      _.filter(games, (game) => game.genres !== undefined && game.genres.length > 0),
      (game) => {
        return game.genres;
      }
    )
  );
  const gamemodeRecords = _.flatten(
    _.map(
      _.filter(games, (game) => game.game_modes !== undefined && game.game_modes.length > 0),
      (game) => {
        return game.game_modes;
      }
    )
  );
  const platformsRecords = _.flatten(
    _.map(
      _.filter(games, (game) => game.platforms !== undefined && game.platforms.length > 0),
      (game) => {
        return game.platforms;
      }
    )
  );

  console.log(`There should be ${games.length} games.`);
  console.log(`There should be ${gamemodes.length} gamemodes.`);
  console.log(`There should be ${genres.length} genres.`);
  console.log(`There should be ${gamesWGenre.length} games with at least one genre.`);
  console.log(`There should be ${screenshots.length} screenshots.`);
  console.log(`There should be ${videos.length} videos.`);
  console.log(`There should be ${genresRecords.length} game-genre records.`);
  console.log(`There should be ${gamemodeRecords.length} game-gamemode records.`);
  console.log(`There should be ${platformsRecords.length} game-platform records.`);
};

/**
 * Insert the games into the database.
 * @param {array} games The array containing the games and all their data.
 */
const createGames = (games) => {
  const newGames = _.map(games, (game) => {
    return {
      name: game.name,
      first_release_date: game.first_release_date,
      ...(game.rating && { rating: game.rating }),
      ...(game.total_rating && { total_rating: game.total_rating }),
      ...(game.aggregated_rating && { aggregated_rating: game.aggregated_rating }),
      summary: game.summary,
      ...(game.cover && { cover_id: game.cover.image_id }),
      ...(game.follows && { followers: game.follows }),
    };
  });

  console.log(`There are ${newGames.length} games.`);
  let c = 0;
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < newGames.length; i++) {
      try {
        await Game.create(newGames[i]);
        c = c + 1;
      } catch (e) {
        console.log(e);
      }
    }
    resolve(c);
  });
};

/**
 * Insert the Gamemodes into the database.
 * @param {array} games The array containing all games and their corresponding Gamemodes.
 */
const createGamemodes = (games) => {
  const Gamemodes = _.map(
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
  console.log(`There are ${Gamemodes.length} game modes.`);
  return Promise.all([Gamemode.bulkCreate(Gamemodes)]);
};

/**
 * Insert the genres into the database.
 * @param {array} games The array containging games and their corresponding genres.
 */
const createGenres = (games) => {
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
  console.log(`There are ${genres.length} genres.`);
  return Promise.all([Genre.bulkCreate(genres)]);
};

/**
 * Insert the screenshots into the database.
 * @param {array} games The array containing all games and their corresponding screenshots.
 */
const createScreenshots = (games) => {
  const screenshots = _.map(
    _.uniqBy(
      _.flatten(
        _.map(
          _.filter(games, (game) => game.screenshots !== undefined && game.screenshots.length > 0),
          (game) => {
            return game.screenshots;
          }
        )
      ),
      'image_id'
    ),
    (item) => {
      return { screenshot_id: item.image_id };
    }
  );
  console.log(`There are ${screenshots.length} screenshots.`);
  return new Promise(async (resolve, reject) => {
    try {
      await Screenshot.bulkCreate(screenshots);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Insert the videos into the database.
 * @param {array} games The array containing all games and their corresponsing videos.
 */
const createVideos = (games) => {
  const videos = _.filter(
    _.uniqBy(
      _.flatten(
        _.map(
          _.filter(games, (game) => game.videos !== undefined && game.videos.length > 0),
          (game) => {
            return game.videos;
          }
        )
      ),
      'video_id'
    ),
    (video) => video.name === 'Trailer'
  );

  console.log(`There are ${videos.length} videos.`);
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < videos.length; i++) {
      try {
        await Video.create(videos[i]);
      } catch (e) {
        console.log(e);
      }
    }
    resolve(true);
  });
};

const connectScreenshotToGame = (games) => {
  const list = _.flatten(
    _.map(
      _.filter(
        _.map(
          _.filter(games, (game) => game.screenshots !== undefined && game.screenshots.length > 0),
          (game) => {
            return { game: game.name, screenshots: game.screenshots };
          }
        ),
        (item) => item.screenshots !== undefined && item.screenshots.length > 0
      ),
      (item) => {
        return _.map(item.screenshots, (s) => {
          return { game: item.game, screenshot_id: s.image_id };
        });
      }
    )
  );

  return new Promise(async (resolve, reject) => {
    let count = 0;
    const screenshotObjs = await Screenshot.findAll();
    for (let i = 0; i < screenshotObjs.length; i++) {
      const screenshot = screenshotObjs[i];
      const game = _.filter(list, (g) => g.screenshot_id === screenshot.screenshot_id)[0];
      if (game) {
        try {
          const gameObj = await Game.findOne({ where: { name: game.game } });
          if (gameObj) {
            try {
              screenshot.setGame(gameObj);
              count = count + 1;
              console.log(i, count);
            } catch (e) {
              console.log(e);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    resolve(count);
  });
};

const connectVideoToGame = (games) => {
  const list = _.flatten(
    _.map(
      _.filter(
        _.map(
          _.filter(games, (game) => game.videos !== undefined && game.videos.length > 0),
          (game) => {
            const videos = _.filter(game.videos, (v) => v.name === 'Trailer');
            return { game: game.name, videos: videos };
          }
        ),
        (item) => item.videos !== undefined && item.videos.length > 0
      ),
      (item) => {
        return _.map(item.videos, (v) => {
          return { game: item.game, video_id: v.video_id };
        });
      }
    )
  );

  return new Promise(async (resolve, reject) => {
    let count = 0;
    const videoObjs = await Video.findAll();
    for (let i = 0; i < videoObjs.length; i++) {
      const video = videoObjs[i];
      const game = _.filter(list, (g) => g.video_id === video.video_id)[0];
      if (game) {
        try {
          const gameObj = await Game.findOne({ where: { name: game.game } });
          if (gameObj) {
            try {
              video.setGame(gameObj);
              count = count + 1;
              console.log(i, count);
            } catch (e) {
              console.log(e);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    resolve(count);
  });
};

const connectGamemodeToGame = (games) => {
  const list = _.flatten(
    _.map(
      _.map(
        _.filter(games, (game) => game.game_modes !== undefined && game.game_modes.length > 0),
        (game) => {
          return { game: game.name, gamemodes: game.game_modes };
        }
      ),
      (item) => {
        return _.map(item.gamemodes, (gm) => {
          return { game: item.game, game_mode_name: gm.name };
        });
      }
    )
  );

  return new Promise(async (resolve, reject) => {
    const gamemodeObjs = await Gamemode.findAll();
    const gameObjs = await Game.findAll();

    let count = 0;
    for (let i = 0; i < list.length; i++) {
      const record = list[i];
      const gameObj = _.filter(gameObjs, (game) => game.name === record.game)[0];
      const gamemodeObj = _.filter(gamemodeObjs, (gamemode) => gamemode.name === record.game_mode_name)[0];

      if (gameObj && gamemodeObj) {
        try {
          await gameObj.addGamemode(gamemodeObj);
          count = count + 1;
          console.log(i, count);
        } catch (e) {
          console.log(e);
        }
      } else console.error('Game or Gamemode not found.');
    }
    resolve(count);
  });
};

const connectGenreToGame = (games) => {
  const list = _.flatten(
    _.map(
      _.map(
        _.filter(games, (game) => game.genres !== undefined && game.genres.length > 0),
        (game) => {
          return { game: game.name, genres: game.genres };
        }
      ),
      (item) => {
        return _.map(item.genres, (g) => {
          return { game: item.game, genre_name: g.name };
        });
      }
    )
  );

  return new Promise(async (resolve, reject) => {
    const genreObjs = await Genre.findAll();
    const gameObjs = await Game.findAll();

    console.log(genreObjs);

    let count = 0;
    for (let i = 0; i < list.length; i++) {
      const record = list[i];
      const gameObj = _.filter(gameObjs, (game) => game.name === record.game)[0];
      const genreObj = _.filter(genreObjs, (genre) => genre.name === record.genre_name)[0];

      if (gameObj && genreObj) {
        try {
          await gameObj.addGenre(genreObj);
          count = count + 1;
          console.log(i, count);
        } catch (e) {
          console.log(e);
        }
      } else console.error('Game or Genre not found.');
    }
    resolve(count);
  });
};

const connectPlatformToGame = (games) => {
  const platforms = ['PC (Microsoft Windows)', 'Linux', 'Mac'];
  const list = _.filter(
    _.flatten(
      _.map(
        _.map(
          _.filter(games, (game) => game.platforms !== undefined && game.platforms.length > 0),
          (game) => {
            return { game: game.name, platforms: game.platforms };
          }
        ),
        (item) => {
          return _.map(item.platforms, (p) => {
            return { game: item.game, platform_name: p.name };
          });
        }
      )
    ),
    (item) => platforms.includes(item.platform_name)
  );

  return new Promise(async (resolve, reject) => {
    const platformObjs = await Platform.findAll();
    const gameObjs = await Game.findAll();

    let count = 0;
    for (let i = 0; i < list.length; i++) {
      const record = list[i];
      const gameObj = _.filter(gameObjs, (game) => game.name === record.game)[0];
      const platformObj = _.filter(platformObjs, (platform) => platform.name === record.platform_name)[0];

      if (gameObj && platformObj) {
        try {
          await gameObj.addPlatform(platformObj);
          count = count + 1;
          console.log(i, count);
        } catch (e) {
          console.log(e);
        }
      } else console.error('Game or Platform not found.');
    }
    resolve(count);
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

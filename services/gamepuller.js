const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');

const { Platform, Screenshot, GameMode, Game } = require('../database/init');

const pullGames = async () => {
  const games = loadData();

  // createGameModes(games)
  //   .then(() => console.log('Game modes added.'))
  //   .catch((err) => console.log(err));

  // createGames(games)
  //   .then(() => console.log('Games added.'))
  //   .catch((err) => console.log(err));

  const game = await Game.findOne({ where: { id: 1 } });
  console.log(game.countScreenshots());

  const screenshot = await Screenshot.findOne({ where: { id: 1 } });
  // const screenshot = await Screenshot.create({ screenshot_id: 1234 });
  console.log(screenshot);

  await screenshot.setGames([game]);
};

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

const createScreenshots = async (games) => {
  const screenshots = _.map(
    _.filter(
      _.uniqBy(
        _.flatten(
          _.map(games, (game) => {
            return game.screenshots;
          })
        ),
        'id'
      ),
      (item) => item !== undefined
    ),
    ({ image_id }) => {
      return { screenshot_id: image_id };
    }
  );

  console.log(`There are ${screenshots.length} screenshots.`);

  return Promise.all(Screenshot.bulkCreate(screenshots));
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    console.log(`Sleeping ${ms}ms.`);
    setTimeout(resolve, ms);
  });
};

const storeData = (data) => {
  try {
    fs.writeFileSync('./games', JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
};

const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync('./games', 'utf8'));
  } catch (err) {
    console.log(err);
    return false;
  }
};

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

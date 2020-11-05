const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');
const Sequelize = require('sequelize');
const { sequelize } = require('../database/init');
const { resolve } = require('path');

const pullGames = async () => {
  const games = loadData();

  const genres = _.filter(
    _.uniqBy(
      _.flatten(
        _.map(games, (game) => {
          return game.genres;
        })
      ),
      'id'
    ),
    (genre) => genre !== undefined
  );

  _.map(genres, ({ name }) => {
    console.log(name);
  });
  console.log(genres);
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

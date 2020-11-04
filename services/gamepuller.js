const axios = require('axios');

const pullGames = async () => {
  const token = await getTwitchToken();
  if (token !== null) getGames(token, 0);
};

const getGames = (token, offset) => {
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
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
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
        return resolve(null);
      });
  });
};

module.exports.pullGames = pullGames;

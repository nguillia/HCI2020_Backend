const { handleResponse } = require('../utils');
const axios = require('axios');

// const date = new Date(Date.now());
// date.setSeconds(date.getSeconds() - 10);

let token = null;

const twitchMiddleware = async (req, res, next) => {
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

  if (token && token.expiration_date >= new Date(Date.now())) {
    console.log('Token valid');

    req.headers['Client-ID'] = process.env.TWITCH_CLIENT_ID;
    req.headers['Authorization'] = `Bearer ${token.access_token}`;

    next();
  } else {
    console.log('Token invalid');
    axios(options)
      .then((response) => {
        if (response.status === 200) {
          if (response.data) {
            const expiration_date = new Date(Date.now());
            expiration_date.setSeconds(expiration_date.getSeconds() + response.data.expires_in);
            token = { access_token: response.data.access_token, expiration_date };

            req.headers['Client-ID'] = process.env.TWITCH_CLIENT_ID;
            req.headers['Authorization'] = `Bearer ${token.access_token}`;

            next();
          }
        }
      })
      .catch((error) => {
        console.log(error);
        return handleResponse(req, res, 401);
      });
  }
};

module.exports = {
  twitchMiddleware,
};

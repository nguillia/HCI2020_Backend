const { getGamesGenres, getGamesWithIds, getRandomGames } = require('./games');
const axios = require('axios');
const _ = require('lodash');

axios.defaults.baseURL = 'https://hci2020-python.herokuapp.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const getGenreBasedRecommendations = ({ userObj }) => {
  console.log(`Getting Genre-Based recommendations for ${userObj.username}.`);
  return new Promise(async (resolve, reject) => {
    //Disliked genres
    const dislikedGenres = await userObj.getGenres();
    // Already liked/disliked games
    const recommendedGames = await userObj.getGames();

    const genres = _.map(dislikedGenres, ({ id }) => id + '');

    const liked = _.map(
      _.filter(recommendedGames, (game) => game.User_Game.liked),
      ({ id }) => id + ''
    );

    const disliked = _.map(
      _.filter(recommendedGames, (game) => !game.User_Game.disliked),
      ({ id }) => id + ''
    );

    try {
      const request = await axios({
        method: 'post',
        url: '/cosine_similarity',
        data: JSON.stringify({
          liked_games: liked,
          disliked_games: disliked,
          genres,
        }),
      });

      if (request.data.success) {
        if (request.data.recommendations.length > 0)
          resolve(await getGamesWithIds({ ids: request.data.recommendations }));
        else resolve(await getRandomGames({ excluded: _.map(recommendedGames, ({ id }) => id) }));
      } else reject('Python server error.');
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const getTextBasedRecommendations = ({ userObj }) => {
  console.log(`Getting Text-Based recommendations for ${userObj.username}.`);
  return new Promise(async (resolve, reject) => {
    //Disliked genres
    const dislikedGenres = await userObj.getGenres();
    // Already liked/disliked games
    const recommendedGames = await userObj.getGames();

    const genres = _.map(dislikedGenres, ({ id }) => id + '');

    const liked = _.map(
      _.filter(recommendedGames, (game) => game.User_Game.liked),
      ({ id }) => id + ''
    );

    const disliked = _.map(
      _.filter(recommendedGames, (game) => !game.User_Game.disliked),
      ({ id }) => id + ''
    );

    try {
      const request = await axios({
        method: 'post',
        url: '/tf_idf',
        data: JSON.stringify({
          liked_games: liked,
          disliked_games: disliked,
          genres,
        }),
      });

      if (request.data.success) resolve(await getGamesWithIds({ ids: request.data.recommendations }));
      else reject('Python server error.');
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const getInitialRecommendations = (genres) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await getGamesGenres(genres));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getGenreBasedRecommendations, getInitialRecommendations, getTextBasedRecommendations };

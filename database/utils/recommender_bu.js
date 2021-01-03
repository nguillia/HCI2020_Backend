const Sequelize = require('sequelize');
const { sequelize, User, Game, Genre, Screenshot, Video, Gamemode, Platform, User_Game } = require('../init');
const { getGames, getGamesGenres, getGamesWithout, getGamesWithoutGenresRecommended } = require('./games');
const similarity = require('compute-cosine-similarity');
const TfIdf = require('tf-idf-search');
const sw = require('stopword');
const tf = require('term-frequency');
const tv = require('term-vector');
const fs = require('fs');
const _ = require('lodash');

const getGenreBasedRecommendations = ({ userObj }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Disliked genres
      const genres = await userObj.getGenres();
      // Already liked/disliked games
      const recommendedGames = await userObj.getGames();
      // All games open for recommendation
      const games = await getGamesWithoutGenresRecommended({
        excludedGenres: _.map(genres, ({ id }) => id),
        excludedGames: _.map(recommendedGames, ({ id }) => id),
      });

      const likedGames = _.map(
        _.filter(recommendedGames, (game) => game.User_Game.liked),
        ({ id }) => id
      );

      console.log(cosineSimilarity(recommendedGames, games));

      let result = JSON.parse(fs.readFileSync(`./scores/similarities/${likedGames[0]}.json`));
      for (let i = 1; i < likedGames.length; i++) {
        const data = JSON.parse(fs.readFileSync(`./scores/similarities/${likedGames[i]}.json`));
        result = _.map(result, (val, id) => {
          console.log(data[id]);
          return { game: val.game, similarity: val.similarity + (data[id].similarity ? data[id].similarity : 0) };
        });
      }

      console.log(
        'FILTER',
        _.filter(result, ({ game }) => _.map(games, ({ id }) => id).includes(game))
      );

      const recommendations = _.slice(
        _.orderBy(
          _.filter(result, ({ game }) => _.map(games, ({ id }) => id).includes(game)),
          'similarity',
          'desc'
        ),
        0,
        5
      );
      resolve(_.filter(games, ({ id }) => _.map(recommendations, ({ game }) => game).includes(id)));
    } catch (error) {
      reject(error);
    }
  });
};

const getTextBasedRecommendations = ({ userObj }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const recommendedGames = await userObj.getGames({ include: [{ model: Genre }] });
      const games = await getGamesWithout({ excluded: _.map(recommendedGames, (game) => game.id) });
      const recommendations = _.slice(tfidf(recommendedGames, games), 0, 5);
      resolve([]);

      // resolve(await getGamesWithIds({ ids: _.map(recommendations, (r) => r.game) }));
    } catch (error) {
      reject(error);
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

const cosineSimilarity = (recommended, games) => {
  const x = _.map(recommended, (game) => {
    const idx = _.map(game.genres, (genre) => genre.id);
    return { game: game.id, genres: _.map(new Array(23).fill(0), (_, i) => (idx.includes(i + 1) ? 1 : 0)) };
  });

  const y = _.map(games, (game) => {
    const idx = _.map(game.genres, (genre) => genre.id);
    return { game: game.id, genres: _.map(new Array(23).fill(0), (_, i) => (idx.includes(i + 1) ? 1 : 0)) };
  });

  const similarities = new Array(y.length);
  for (let i = 0; i < y.length; i++) {
    let s = 0;
    for (let j = 0; j < x.length; j++) {
      s = s + similarity(x[j].genres, y[i].genres);
    }
    s = s / x.length;
    similarities[i] = { game: y[i].game, similarity: s };
  }

  return _.orderBy(similarities, ['similarity'], ['desc']);
};

const tfidf = (recommended, games) => {
  const x = _.map(recommended, (game) => {
    return {
      game: game.id,
      text: _.join(
        sw.removeStopwords(
          game.summary
            .replace(/[^a-zA-Z ]/g, '')
            .toLowerCase()
            .split(' ')
        ),
        ' '
      ),
    };
  });

  const y = _.map(games, (game) => {
    return {
      game: game.id,
      text: sw.removeStopwords(
        game.summary
          .replace(/[^a-zA-Z ]/g, '')
          .toLowerCase()
          .split(' ')
      ),
    };
  });

  console.log(x[0], y[0]);

  const corpus = _.map(y, ({ game, text }) => {
    const vec = tv.getVector(text);
    return _.join(
      _.map(
        _.orderBy(
          _.map(tf.getTermFrequency(vec, { scheme: tf.logNormalization }), (freq) => {
            return { word: freq[0][0], freq: freq[1] };
          }),
          'freq',
          'desc'
        ),
        ({ word }) => word
      ),
      ' '
    );
  });

  const tf_idf = new TfIdf();
  tf_idf.createCorpusFromStringArray(corpus);
  const results = tf_idf.rankDocumentsByQuery(x[0].text);
  console.log(results);

  return [];
};

module.exports = { getGenreBasedRecommendations, getInitialRecommendations, getTextBasedRecommendations };

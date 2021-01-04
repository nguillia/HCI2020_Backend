const { Game, Genre, Game_Genre } = require('../database/init');
const similarity = require('compute-cosine-similarity');
const Sequelize = require('sequelize');
const fs = require('fs');
const sw = require('stopword');
const _ = require('lodash');

const removeGames = () => {
  return new Promise(async (resolve, reject) => {
    const games = await Game.findAll();
    const list = _.map(games, ({ id }) => id);
  });
};

const createJson = () => {
  return new Promise(async (resolve, reject) => {
    const games = await Game.findAll({ include: [{ model: Genre }], order: [['followers', 'DESC']], limit: 5000 });
    const result = _.map(games, ({ id, summary, genres }) => {
      return {
        game: id,
        genres: _.join(
          _.map(genres, ({ id }) => id),
          '|'
        ),
        summary: _.join(
          sw.removeStopwords(
            summary
              .replace(/[^a-zA-Z ]/g, '')
              .toLowerCase()
              .split(' ')
          ),
          ' '
        ),
      };
    });

    try {
      fs.writeFileSync(`./scores/games.json`, JSON.stringify(result));
      console.log(`Saved to file.`);
    } catch (error) {
      console.error(error);
    }
  });
};

const cosineSimilarity = () => {
  return new Promise(async (resolve, reject) => {
    const rawGames = await Game.findAll({ include: [{ model: Genre }] });
    const allGames = _.map(rawGames, (game) => {
      const idx = _.map(game.genres, (genre) => genre.id);
      return { game: game.id, genres: _.map(new Array(23).fill(0), (_, i) => (idx.includes(i + 1) ? 1 : 0)) };
    });
    for (let i = 0; i < allGames.length; i++) {
      let scores = [];
      for (let j = 0; j < allGames.length; j++) {
        if (j !== i) {
          const s = similarity(allGames[i].genres, allGames[j].genres);
          if (s !== 0)
            scores = _.concat(scores, {
              game: allGames[j].game,
              similarity: s,
            });
        } else scores = _.concat(scores, { game: allGames[j].game, similarity: -1 });
      }
      try {
        scores = _.slice(_.orderBy(scores, 'similarity', 'desc'), 0, 1000);
        fs.writeFileSync(`./scores/similarities/${allGames[i].game}.json`, JSON.stringify(scores));
        console.log(`Saved to file, game: ${allGames[i].game}, length: ${scores.length}.`);
      } catch (error) {
        console.error(error);
      }
    }

    // const rawGames = await Game.findAll({ include: [{ model: Genre }] });
    // const allGames = _.map(rawGames, (game) => {
    //   const idx = _.map(game.genres, (genre) => genre.id);
    //   return { game: game.id, genres: _.map(new Array(23).fill(0), (_, i) => (idx.includes(i + 1) ? 1 : 0)) };
    // });
    // for (let i = 0; i < allGames.length; i++) {
    //   const scores = new Array(allGames.length);
    //   for (let j = 0; j < allGames.length; j++) {
    //     if (j !== i) {
    //       const s = similarity(allGames[i].genres, allGames[j].genres);
    //       if (s !== 0) scores[j] = { game: allGames[j].game, similarity: s };
    //     } else scores[j] = { game: allGames[j].game, similarity: -1 };
    //   }
    //   try {
    //     fs.writeFileSync(`./scores/similarities/${allGames[i].game}.json`, JSON.stringify(scores));
    //     console.log(`Saved to file, game: ${allGames[i].game}.`);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
  });
};

module.exports = { createJson, cosineSimilarity, removeGames };

const Sequelize = require('sequelize');

const Video = {
    name: 'video',
    attributes: {
      video_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
      },
    },
    options: {},
  };
  
  module.exports = Video;
  
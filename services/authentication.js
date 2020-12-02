const bcrypt = require('bcrypt');
const { getUserByUsername } = require('../database/utils/users');

const login = ({ username, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await getUserByUsername({ username });
      console.log(password, user.password);
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) resolve('Logged in.');
          reject('Username or Password incorrect.');
        });
      } else reject('Username or Password incorrect.');
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  login,
};

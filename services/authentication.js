const bcrypt = require('bcrypt');
const { getUserByUsername } = require('../database/utils/users');
const { generateToken } = require('./utils');

const login = ({ username, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch user from database
      const user = await getUserByUsername({ username });
      if (user) {
        // User exists - Verify hashed password with entered password
        bcrypt.compare(password, user.password, async (err, result) => {
          // Password valid
          if (result) {
            // Generate JWT
            const token = generateToken(user);
            resolve(token);
          }
          // Password is invalid
          reject('Username or Password incorrect.');
        });
      }
      // User does not exist
      else reject('Username or Password incorrect.');
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  login,
};

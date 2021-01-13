const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { User } = require('../database/init');

// Generate access
generateToken = ({ id, username }) => {
  const userSession = {
    userId: id,
    username: username,
  };

  // Create private key by combining JWT secret and xsrf token
  const privateKey = process.env.JWT_SECRET;

  // Generate access token
  const token = jwt.sign(userSession, privateKey, { expiresIn: process.env.TOKEN_LIFE });

  return {
    token,
  };
};

// Verify token
verifyToken = (token, callback) => {
  const privateKey = process.env.JWT_SECRET;
  jwt.verify(token, privateKey, callback);
};

// Handle API response
handleResponse = (req, res, statusCode, data, message) => {
  let isError = false;
  let errorMessage = message;

  switch (statusCode) {
    case 204:
      return res.sendStatus(204);
    case 400:
      isError = true;
      errorMessage = message || 'Bad Request';
      break;
    case 401:
      isError = true;
      errorMessage = message || 'Unauthorized';
      break;
    case 403:
      isError = true;
      errorMessage = message || 'User is not authorized to access this resource with an explicit deny.';
      break;
    default:
      break;
  }

  const resObj = data || {};

  if (isError) {
    resObj.error = true;
    resObj.message = errorMessage;
  }

  return res.status(statusCode).json(resObj);
};

makeUsers = async () => {
  const amountUsers = 15;
  let users = [];
  for (let u = 0; u < amountUsers; u++) {
    // Generate username
    const username = `P${u + 1}-`;

    // Generate password
    const password = generatePassword();

    // Bcrypt password
    const hashed = await bcrypt.hash(password, 12);

    // Save user
    users.push({ username: `${username}1`, password, system: 1 });
    users.push({ username: `${username}2`, password, system: 2 });

    // Add user to db
    const user1 = await User.create({ username: `${username}1`, password: hashed, system: 1 });
    const user2 = await User.create({ username: `${username}2`, password: hashed, system: 2 });
    console.log(`${user1.username} and ${user2.username} were saved to the DB.`);
  }
  const data = JSON.stringify(users);
  fs.writeFileSync('./users.json', data);
  console.log('Users saved to file.');
};

generatePassword = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports = {
  generateToken,
  verifyToken,
  handleResponse,
  makeUsers,
};

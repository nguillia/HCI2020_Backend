const jwt = require('jsonwebtoken');

// Cookie options for refresh token
const COOKIE_OPTIONS = {
  domain: 'localhost', // Comment when leaving production
  httpOnly: true,
  secure: !(process.env.NODE_ENV !== 'production'),
  signed: true,
};

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

module.exports = {
  COOKIE_OPTIONS,
  generateToken,
  verifyToken,
  handleResponse,
};

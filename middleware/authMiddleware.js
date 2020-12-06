const { handleResponse, verifyToken } = require('../services/utils');

const authMiddleware = async (req, res, next) => {
  // Check header, url params or post params for token
  const header = req.headers['authorization'];
  if (!header) return handleResponse(req, res, 401);

  if (!header.includes('Bearer ')) return handleResponse(req, res, 401);
  const token = header.replace('Bearer ', '');

  // Verify token with secret and xsrf token
  verifyToken(token, (err, payload) => {
    if (err) return handleResponse(req, res, 401);
    else {
      req.body.user = payload;
      next();
    }
  });
};

module.exports = {
  authMiddleware,
};

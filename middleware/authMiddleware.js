const { handleResponse, verifyToken } = require('../services/utils');
const { User } = require('../database/init');

const authMiddleware = async (req, res, next) => {
  // Check header, url params or post params for token
  const header = req.headers['authorization'];
  if (!header) return handleResponse(req, res, 401);

  if (!header.includes('Bearer ')) return handleResponse(req, res, 401);
  const token = header.replace('Bearer ', '');

  // Verify token with secret and xsrf token
  verifyToken(token, async (err, payload) => {
    if (err) return handleResponse(req, res, 401);
    else {
      req.body.user = await User.findOne({ where: { id: payload.userId }, attributes: ['id', 'username', 'system'] });
      next();
    }
  });
};

module.exports = {
  authMiddleware,
};

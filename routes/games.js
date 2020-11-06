const router = require('express').Router();
const { handleResponse } = require('../../services/utils');

router.get('/list', (req, res) => {
  return handleResponse(req, res, 200, { success: true, games: response.data });
  return handleResponse(req, res, 401);
});

module.exports = router;

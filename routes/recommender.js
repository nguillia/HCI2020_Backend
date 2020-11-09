const router = require('express').Router();
const { handleResponse } = require('../services/utils');

router.post('/recommend', (req, res) => {
  // Insert magic recommender function here.
  return handleResponse(req, res, 200, { success: true });
});

module.exports = router;

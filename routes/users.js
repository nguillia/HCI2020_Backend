const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getUserInfo } = require('../database/utils/users');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { User } = require('../database/init');
const { check } = require('express-validator');

router.post('/user', [check('id').toInt().isInt(), validationMiddleware], async (req, res) => {
  try {
    const user = await getUserInfo({ id: req.body.id });
    if (user) return handleResponse(req, res, 200, { success: true, data: user });
    else return handleResponse(req, res, 400, {}, 'User not found.');
  } catch (err) {
    return handleResponse(req, res, 400, {}, err);
  }
});

module.exports = router;

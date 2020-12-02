const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { check } = require('express-validator');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { login } = require('../services/authentication');

router.post(
  '/login',
  [
    check('username').exists().withMessage('Empty Field: username is required.').trim().escape(),
    check('password').exists().withMessage('Empty Field: password is required.'),
    validationMiddleware,
  ],
  async (req, res) => {
    console.log(req.body.password);
    try {
      return handleResponse(req, res, 200, {
        success: true,
        data: await login({ username: req.body.username, password: req.body.password }),
      });
    } catch (err) {
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

module.exports = router;

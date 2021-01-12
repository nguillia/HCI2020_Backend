const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { check } = require('express-validator');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { login } = require('../services/authentication');

router.get('/wake', (req, res) => {
  return handleResponse(req, res, 200, {
    success: true,
    data: 'Waked',
  });
});

router.post(
  '/login',
  [
    check('username').exists().withMessage('Empty Field: username is required.').trim().escape(),
    check('password').exists().withMessage('Empty Field: password is required.'),
    validationMiddleware,
  ],
  async (req, res) => {
    try {
      const user = await login({ username: req.body.username, password: req.body.password });
      return handleResponse(req, res, 200, {
        success: true,
        data: user,
      });
    } catch (err) {
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

module.exports = router;

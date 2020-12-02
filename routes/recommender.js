const router = require('express').Router();
const { handleResponse } = require('../services/utils');
const { getRecommendations } = require('../database/utils/recommender');
const { isUser, isisValidArray, toIntegerArray } = require('../middleware/validator');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { check } = require('express-validator');

router.post(
  '/recommend',
  [
    check('id')
      .exists()
      .withMessage('Empty Field: id is required.')
      .toInt()
      .isInt()
      .withMessage('Integer Error: id should be an integer value.')
      .custom(async (value, { req }) => await isUser(value, req)),
    validationMiddleware,
  ],
  async (req, res) => {
    try {
      return handleResponse(req, res, 200, {
        success: true,
        data: { games: await getRecommendations({ userObj: req.body.user }) },
      });
    } catch (err) {
      console.log('err', err);
      return handleResponse(req, res, 400, {}, err);
    }
  }
);

module.exports = router;

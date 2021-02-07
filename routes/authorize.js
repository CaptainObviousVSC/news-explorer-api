const router = require('express').Router();
const { errors, Joi, celebrate } = require('celebrate');
const { login, createUser } = require('../controllers/getUsers');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru', 'ua'] } }).required(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru', 'ua'] } }).required(),
    password: Joi.string().required(),
  }),
}), createUser);
router.use(errors());
module.exports = router;

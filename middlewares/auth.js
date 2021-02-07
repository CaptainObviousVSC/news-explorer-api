require('dotenv').config();
const jwt = require('jsonwebtoken');
const LoginError = require('../errors/LoginError');
const { NODE_ENV, JWT_SECRET } = require('../configs/config');

function auth(req, res, next) {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new LoginError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new LoginError('Необходима авторизация'));
  }

  req.user = payload;
  next();
  return req.user;
}
module.exports = auth;

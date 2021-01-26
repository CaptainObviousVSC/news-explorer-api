const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const getUserInfo = (req, res) => {
  console.log(req.params);
  User.findById(req.user).orFail(() => {
    const err = new Error('Невозможно получить пользователей');
    err.statusCode = 404;
    throw err;
  }).then((user) => {
    console.log(user);
    res.status(200).send(user);
  })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Невалидный ID' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: 'Невозможно получить информацию о пользователе' });
      }
      return res.status(500).send({ message: 'Ошибка сервера'});
    });
};

const createUser = (req, res) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email }).select('+password').then((user) => {
    console.log({ email });
    if (user) {
      console.log(user);
      const err = new Error('пользователь с таким email уже зарегестрирован');
      err.statusCode = 409;
      throw err;
    }
    return bcrypt.hash(password, 10);
  })
    .then((hash) => User.create({
      name, email: req.body.email, password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorList = Object.keys(err.errors);
        const messages = errorList.map((item) => err.errors[item].message);
        return res.status(400).send({message : `Ошибка валидации: ${messages.join(' ')}`});
      } else if (err.statusCode === 409) {
        return res.status(409).send({message : 'Пользователь с таким email уже зарегестрирован'});
      } else {
        return res.status(400).send({message : 'Не заполнено одно или оба поля заполнены не правильно'});
      }
    });
};
const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password).then((matched) => {
          const token = jwt.sign({
            _id: user._id,
          }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          if (!matched) {
            return res.status(401).send({message : 'Неправильные почта или пароль'});
          }
          res.send({ token });
        });
      }
      return res.status(401).send({message : 'Неправильные почта или пароль'});
    })
    .catch((err) => {
      return res.status(500).send({ message: 'Ошибка сервера'});
    });
};
module.exports = {
  getUserInfo, createUser, login,
};
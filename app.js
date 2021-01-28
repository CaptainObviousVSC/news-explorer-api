const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors, Joi, celebrate } = require('celebrate');

const usersRoutes = require('./routes/users');
const articlesRoutes = require('./routes/articles');
const auth = require('./middlewares/auth');
const { errorLogger, requestLogger } = require('./middlewares/loggers');
const { login, createUser } = require('./controllers/getUsers');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors())
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/news-apidb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use('/', auth, usersRoutes);
app.use('/', auth, articlesRoutes);
app.use(errorLogger);
app.use(errors());
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
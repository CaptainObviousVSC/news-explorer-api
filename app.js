const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const usersRoutes = require('./routes/users');
const articlesRoutes = require('./routes/articles');
const authorizeRoutes = require('./routes/authorize');
const auth = require('./middlewares/auth');
const { errorHandler404, errorHandler500 } = require('./errors/errorHandler');
const { errorLogger, requestLogger } = require('./middlewares/loggers');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/news-apidb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use('/', authorizeRoutes);
app.use('/', auth, usersRoutes);
app.use('/', auth, articlesRoutes);
app.use('/', errorHandler404);
app.use('/', errorHandler500);
app.use(errorLogger);
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

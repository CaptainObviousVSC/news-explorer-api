const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
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
// app.use((req, res, next) => {
//   req.user = {
//     _id: '5fa85003496f3b4da4470249',
//   };
//   next();
// });
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', auth, usersRoutes);
app.use('/', auth, articlesRoutes);
app.use(errorLogger);
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
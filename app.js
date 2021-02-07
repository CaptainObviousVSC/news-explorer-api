const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router/router');
const { DB, SERVER_PORT } = require('./configs/config');
const { errorLogger, requestLogger } = require('./middlewares/loggers');

const app = express();
app.use(cors());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(router);
app.use(errorLogger);
app.listen(SERVER_PORT, () => console.log(`App listening on port ${SERVER_PORT}`));

const router = require('express').Router();

const usersRoutes = require('../routes/users');
const articlesRoutes = require('../routes/articles');
const authorizeRoutes = require('../routes/authorize');
const { errorHandler404, errorHandler500 } = require('../errors/errorHandler');
const auth = require('../middlewares/auth');

router.use('/', authorizeRoutes);
router.use('/', auth, usersRoutes);
router.use('/', auth, articlesRoutes);
router.all('*', errorHandler404);
router.all('*', errorHandler500);


module.exports = router;

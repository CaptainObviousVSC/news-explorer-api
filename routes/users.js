const router = require('express').Router();

const { getUserInfo } = require('../controllers/getUsers');

router.get('/users/me', getUserInfo);
module.exports = router;

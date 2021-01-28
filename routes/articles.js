const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const { getArticles, postArticle, deleteArticle } = require('../controllers/getArticle');
const { validatorLink } = require('../utils/validator');
router.get('/articles', getArticles);
router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(validatorLink),
    image: Joi.string().required().pattern(validatorLink),
  }),
}), postArticle);
router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().length(24).hex(),
  }),
}), deleteArticle);
router.use(errors());
module.exports = router;
const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getArticles = (req, res, next) => {
  Article.find({}).select('+owner').populate('owner').orFail(() => {
    throw new NotFoundError('Невозможно получить сохраненные статьи');
  })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new NotFoundError('Невозможно получить сохраненные статьи'));
      }
      next(err);
    });
};
const postArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, image, link,
  } = req.body;
  const { _id } = req.user;
  Article.create({
    keyword, title, text, date, source, link, image, owner: _id,
  }).then((data) => res.send({
    _id: data._id,
    title: data.title,
    text: data.text,
    date: data.date,
    source: data.source,
    link: data.link,
    image: data.image,
  }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorList = Object.keys(err.errors);
        const messages = errorList.map((item) => err.errors[item].message);
        next(new BadRequestError(`Ошибка валидации: ${messages.join(' ')}`));
      } else {
        next();
      }
    });
};
const deleteArticle = (req, res, next) => {
  console.log(req.params);
  const { articleId } = req.params;
  const userId = req.user._id;
  Article.findById(articleId)
    .orFail(() => {
      const err = new ForbiddenError('Forbidden, доступ запрещен');
      err.statusCode = 403;
    })
    .then((article) => {
      if (article.owner.toString() === userId) {
        Article.findByIdAndRemove(articleId).then((articles) => res.status(200).send(articles));
      } else {
        throw new ForbiddenError('Forbidden, доступ запрещен');
      }
    })
    .catch((err) => {
      if (err.statusCode === 403) {
        next(new ForbiddenError('Forbidden, доступ запрещен'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('пользователь или статья не найдены не найден'));
      }
      next(err);
    });
};
module.exports = { getArticles, postArticle, deleteArticle };

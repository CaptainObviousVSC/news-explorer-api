const Article = require('../models/article');

const getArticles = (req, res) => {
  Article.find({}).populate('owner').orFail(() => {
    const err = new Error('Невозможно получить сохраненные статьи');
    err.statusCode = 404;
    throw err;
  }).then((data) => res.send(data))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Невалидный ID' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: 'Невозможно получить сохраненные статьи' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};
const postArticle = (req, res) => {
  const { keyword, title, text, date, source, image, link } = req.body;
   const { _id } = req.user;
  Article.create({ keyword, title, text, date, source, link, image, owner: _id }).then((data) => res.send(data))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      const errorList = Object.keys(err.errors);
      const messages = errorList.map((item) => err.errors[item].message);
      res.status(400).send({ message: `Ошибка валидации: ${messages.join(' ')}` });
    } else {
      res.status(500).send({ message: 'Ошибка на сервере' });
    }
  });
};
const deleteArticle = (req, res) => {
  console.log(req.params)
  const { articleId } = req.params
  Article.findByIdAndRemove(articleId).orFail(() => {
    const err = new Error('Невозможно удалить');
    err.statusCode = 404;
    throw err;
  }).then(() => res.status(200).send({ message: 'Карточка удалена' })).catch((err) => {
    if (err.kind === 'ObjectId') {
      return res.status(400).send({ message: 'Невалидный ID' });
    }
    if (err.statusCode === 404) {
      return res.status(404).send({ message: 'Невозможно удалить' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  });
};
module.exports = { getArticles, postArticle, deleteArticle, }
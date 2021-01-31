const errorHandler404 = (err, req, res, next) => {
  const { statusCode = 404, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 404
        ? 'Ничего не найдено'
        : message,
    });
  next();
};
const errorHandler500 = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
module.exports = { errorHandler404, errorHandler500 };

const validator = require('validator');

const validatorLink = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
function validatorEmail(email) {
  return validator.isEmail(email);
}
module.exports = { validatorEmail, validatorLink };

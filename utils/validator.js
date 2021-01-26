const validatorLink = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const validatorEmail = function (email) {
  const re = /^.+@.+\..+$/;
  return re.test(email);
};
module.exports = { validatorEmail, validatorLink };
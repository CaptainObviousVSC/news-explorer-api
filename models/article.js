const mongoose = require('mongoose');
const { validatorLink } = require('../utils/validator')
const userSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: validatorLink,
  },
  image: {
    type: String,
    required: true,
    validate: validatorLink,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});
module.exports = mongoose.model('article', userSchema);
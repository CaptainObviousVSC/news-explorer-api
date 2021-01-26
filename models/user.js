const mongoose = require('mongoose');
const { validatorEmail } = require('../utils/validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validatorEmail,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
module.exports = mongoose.model('user', userSchema);
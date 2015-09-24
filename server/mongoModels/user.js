var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

var User = mongoose.model('User', userSchema);

User.comparePassword = function(candidatePassword, savedPassword, cb) {
  if (candidatePassword === savedPassword) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = User;
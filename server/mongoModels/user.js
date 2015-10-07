var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var bluebird = require('bluebird');


var userSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

//need to update for facebook Authentication:

// var userSchema = mongoose.Schema({
//   facebook : {
//     id: String,
//     token : String,

//     //needs to be email for facebook, not username.
//     email : String,
//     name : String
//   }
// })
var User = mongoose.model('User', userSchema);

User.comparePassword = function(candidatePassword, savedPassword, cb) {
  // console.log('\n\ncandidatePassword = ' + candidatePassword + '\nsavedPassword = ' + savedPassword + '\n\n');
  bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    // console.log('This is the value of "isMatch": ',isMatch);
    cb(null, isMatch);
  });
};

userSchema.pre('save', function(next){
  var cipher = bluebird.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      console.log('This is the password before we hash it: ', this.password);
      this.password = hash;
      console.log('This is the password after we hash it: ', this.password);
      next();
    });
});

module.exports = User;
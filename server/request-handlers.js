var db = require('./config');
var bodyParser = require('body-parser');
var User = require('./mongoModels/user');

module.exports.user = function (request, response) {
  if(request.method==="GET"){
    console.log("requesting user list:\n");
    User.find({}, function (err, users) {
      if (err) {
        console.log("There was an error querying the database.", err);
      }
      console.log('Returning the user list: ', users);
      response.send(users);
    });
  }

};

module.exports.login = function (request, response) {
  if (request.method === "POST") {
    var username = request.body.username;
    var password = request.body.password;

    User.findOne({ username: username })
      .exec(function(err, user) {
        if (!user) {
          response.send('User not found in the database!');
        } else {
          User.comparePassword(password, user.password, function(err, match) {
            if (match) {
              // util.createSession(request, response, user);
              response.send('Your passwords match!  Hooray.');
            } else {
              response.send('Passwords do not match, you scoundrel!');
            }
          });
        }
    });
  }
};

module.exports.register = function (request, response) {
  if (request.method === "POST"){
    var username = request.body.username;
    var password = request.body.password;
    console.log('Saving username: "' + username + ' and password: "' + password + '" to the database. ');
    User.create({ username: username, password: password }, function (err, small) {
      if (err) return handleError(err);
    });
    response.send('User registered.');
  }
};

module.exports.text = function (request, response) {

  var data = {}
  data.text = "Face it, Nate, you are about the greatest thing since pizza. No one else can hoist like you can. \
  Your best friend says your the green-est person in the world. Sure, you once got drunk and lost your phone in the oven, \
  but you also... I don\'t know, worked at an orphanage? So, buttercup, today is the day you’re going to stop beating yourself \
  up for being sucky and start loving yourself for being happy, joyous, and elated. And if people give you a festering time, \
  just tell ‘em they can take their hair and squat it up their cornea!"
  
  console.log('in server text method');
  if(request.method === "GET"){
    response.send(data);
  }


};



var db = require('./config');
var bodyParser = require('body-parser');
var User = require('./mongoModels/user');
var req = require('request');
var randomWiki = require('random-wiki');
var wikiJSON = require('wikipedia2json');

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


module.exports.wikipedia = function(req, res){
  var articleTitle = "";
  randomWiki(function (err, topic) {
    console.log(topic);
    articleTitle = topic;
    wikiJSON.from_api(topic, "en", function(markup){
      //var obj= wtf_wikipedia.parse(markup);
      var text= wikiJSON.plaintext(markup);
      console.log(text);
    });
  });
  res.send(200);
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
              // utility.createSession(request, response, user);
              response.send('Your passwords match!  Hooray.');
            } else {
              console.log('This is match from the request handler: ', match);
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
    User.create( {username: username, password: password} , function (err, small) {
      if (err) return handleError(err);
    });
    response.send('User registered.');
  }
};

module.exports.text = function (request, response) {
  // Correct errors in API string output before serving back to client
  var formatString = function (string) {
    var result = '';
    // replace "&quot;" with ""
    var escapedQuotes = string.replace(/&quot;/g, '"');
    // replace out-of-place "?"s with "'"s
    for (var i = 0; i < escapedQuotes.length; i++) {
      if (escapedQuotes[i] === "?") {
        if (escapedQuotes[i-1] === "s" && escapedQuotes[i+1] === "a") {
          // handle one-off typo on API return object id# 283
          result += '... ';
        } else if (escapedQuotes[i+1] !== " " && escapedQuotes[i+1] !== '"') {
          result += "'";
        } else {
          result += escapedQuotes[i];
        }
      } else {
        result += escapedQuotes[i];
      }
    }

    return result;
  };

  randomWiki(function (err, topic) {
    var data = {};
    //console.log(topic);
    articleTitle = topic;
    wikiJSON.from_api(topic, "en", function(markup){
      data.text= formatString(wikiJSON.plaintext(markup));
      response.send(data);
    });
  });

  // Hit API for data, correct errors, serve to client
  // req('http://api.icndb.com/jokes/random/50', function (error, res, body) {
  //   var data = {};
  //   var jokes = [];
  //   var parsedBody = JSON.parse(body);
  //   parsedBody.value.forEach(function(jokeObject) {
  //     jokes.push(jokeObject.joke);
  //   });
  //   data.text = jokes.join(' ');
  //   data.text = formatString(data.text);
  //   response.send(data);
  // });

};




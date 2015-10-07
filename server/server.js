var express = require('express');
var app = express();
//var mongoose = require("mongoose");
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var http = require('http').Server(app);
var io = require('socket.io')(http);
var handlers = require('./request-handlers');
var socketHandlers = require('./socket-handlers');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
// Middleware
var parser = require('body-parser');
// Set what we are listening on.
app.set("port", 3000);

// Logging and parsing
app.use(parser.json());

// Output CSS files from SASS
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, "../client/sass"),
    dest: path.join(__dirname, "../client/dist/css"),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/dist/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

// Serve the client files
app.use(express.static(__dirname + "/../client"));

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session())

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });

passport.use( new FacebookStrategy({
  clientID: "1666396103573629",
  clientSecret: "21352511ea81f083bc803c46f7398c6e",
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, 
function(acessToken, refreshToken, profile, done){
  //query for users that have already loggedin with facebook. 
  //SCHEMA for facebook users for database:
// var FacebookUserSchema = new mongoose.Schema({
//     fbId: String,
//     email: { type : String , lowercase : true},
//     name : String
// });
// var FbUsers = mongoose.model('fbs',FacebookUserSchema);
  FbUsers.findOne({fbId : profile.id}, function(err, oldUser){
    if(oldUser){
      done(null, oldUser);
    } else{
      var newUser = new FbUsers({
        fbId : profile.id,
        email; profile.emails[0].value,
        name: profile.displayName
      }).save(function(err, newUser){
        if(err ) throw err;
        done(null, newUser);
      })
    }
  }) 
}
))

// If we are being run directly, run the server.
if (!module.parent) {
  http.listen(app.get("port"));
  console.log("Listening on", app.get("port"));
}

/*----------  Server Cache  ----------*/

var users = { numberOfUsers: 0 };

/*----------  Socket listeners  ----------*/

io.on('connection', function (socket) {

  // 'login' listener for 'login' event, emitted from AppView
  socket.on('login', function() {
    socketHandlers.loginUser(socket);
    users.numberOfUsers++;

    console.log('There are ' + users.numberOfUsers + ' users connected.');
    console.log('This is the users object:\n', users);

    // If there are enough users to play, emit 'match' event to all sockets
    if (users.numberOfUsers === 2) {
      console.log('\nThere are two users, emitting "match" event.\n');
      io.emit('match');
    } else {
      io.emit('practice');
    }
  });

  socket.on('update', function (data) {
    // update the opponent with this user's data
    // pass in anonymous function to be executed upon update completion
    socketHandlers.updateScore(socket, data, function () {
      // save the result of checkForEndGame to see if it 
      // is necessary to emit an update event
      socket.broadcast.emit('update', data);
      var endGameStatus = socketHandlers.checkForEndGame(socket);

    });
  });

}); 


/*----------  Routes  ----------*/


// request user data from database
app.use('/user', handlers.user);

// login user and create session
app.use('/login', handlers.login);

// register a new user to the databse
app.use('/register', handlers.register);

// serve passage to the client
app.use('/text', handlers.text);

module.exports.users = users;

var express = require('express');
var app = express();
var config = require('./oauth.js')
var mongoose = require('mongoose')
var passport = require('passport')
  //this module lets us view messages that come back with authentication
var flash = require('connect-flash');
var FacebookStrategy = require('passport-facebook')
  .Strategy;
var http = require('http')
  .Server(app);
var io = require('socket.io')(http);
var handlers = require('./request-handlers');
var socketHandlers = require('./socket-handlers');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// for when we have a database set up:
// var db = require('../mongoModels/user.js')

var parser = require('body-parser');
// pass passport for configuration
require('../config/passport')(passport);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//ejs for templating.

app.set('view engine', 'ejs');

//things that are required for passport:

app.use(session({
  secret: 'fareezeatscookiesthatswhyheisoverweight'
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//routes
require('../../client/routes.js')(app, passport);

// Set what we are listening on.
var port = process.env.PORT || 3000;

app.set("port", port);

// Logging and parsing
app.use(parser.json());

// Output CSS files from SASS
app.use(sassMiddleware({
  /* Options */
  src: path.join(__dirname, "../client/sass"),
  dest: path.join(__dirname, "../client/dist/css"),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/dist/css' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

// Serve the client files
app.use(express.static(__dirname + "/../client"));


// If we are being run directly, run the server.
if (!module.parent) {
  http.listen(app.get("port"));
  console.log("Listening on", app.get("port"));
}

/*----------  Server Cache  ----------*/

var users = {
  numberOfUsers: 0
};

/*----------  Socket listeners  ----------*/

io.on('connection', function(socket) {

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

  socket.on('update', function(data) {
    // update the opponent with this user's data
    // pass in anonymous function to be executed upon update completion
    socketHandlers.updateScore(socket, data, function () {
      // save the result of checkForEndGame to see if it
      // is necessary to emit an update event
      socket.broadcast.emit('update', data);
      var endGameStatus = socketHandlers.checkForEndGame(socket);
      if (endGameStatus === "user1Winner" || endGameStatus === "user2Winner") {
        users.numberOfUsers = 0;
      }

    });
  });

});


/*----------  Routes  ----------*/

app.use('/wikipedia', handlers.wikipedia);

// // request user data from database
// app.use('/user', handlers.user);

// // login user and create session
// app.use('/login', handlers.login);

// // register a new user to the databse
// app.use('/register', handlers.register);

// // serve passage to the client
// app.use('/text', handlers.text);

module.exports.users = users;
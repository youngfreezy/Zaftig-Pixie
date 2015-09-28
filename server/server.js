var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var handlers = require('./request-handlers');
var socketHandlers = require('./socket-handlers');


// Middleware
var parser = require('body-parser');

// Set what we are listening on.
app.set("port", 3000);

// Logging and parsing
app.use(parser.json());

// Serve the client files
app.use(express.static(__dirname + "/../client"));

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get("port"));
  console.log("Listening on", app.get("port"));
}

/*----------  Socket listeners  ----------*/

io.on('connection', function (socket) {

  socket.on('update', function (data) {
    // update the other users with this user's data
    socket.broadcast.emit('update', data);
  });
  
    /* THIS LOGIC WILL BE IMPLEMENTED CLIENT SIDE?*/
  // socket.on('endGame', function (data) {
  //   // update the other users with the end game results
  //   socket.broadcast.emit('endGame', data);
  // });


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
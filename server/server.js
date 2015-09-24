var express = require('express');
var 

// Middleware
var parser = require('body-parser');

var app = express();

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

/*----------  Routes  ----------*/


// request user data from database
app.get('/user', funciton (request, response) {

});

// login user and create session
app.post('/login', funciton (request, response) {

});

// register a new user to the databse
app.post('/register', funciton (request, response) {

});

// serve passage to the client
app.get('/text', funciton (request, response) {

});
var express = require('express');

// Middleware
var parser = require('body-parser');

// Router
var router = require('./routes.js');

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


app.get('/test', function (request, response) {
  console.log('Test totally works, biatch!');
});
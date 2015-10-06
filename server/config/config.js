var mongoose = require('mongoose');

mongoURI = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/shortlydb';
// connect to local server or deployment server
mongoose.connect(mongoURI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", function() {
  console.log('Mongodb connection open');
});

// in case we want to add Twitter later.
socialLogins.exports = {
	'facebookAuth': {
		'clientID' : 1666396103573629,
		'clientSecret' : '21352511ea81f083bc803c46f7398c6e'
	}
}
db.exports = db;


///////////////////////////////////////////////


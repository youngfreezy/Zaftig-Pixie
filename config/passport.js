var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../server/mongoModels/user.js');

//the auth variables
var configAuth = require('./auth.js');

module.exports = function(passport){
	//setting up sessions for passport.  

	//serialize the user for the session:

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	//used to deserialize the user:

	passport.deserializeUser(function(id, done){
		//User.findById(id, function(err, user){
		// 	done(err, user);
		// })
	})

	passport.use(new FacebookStrategy({
		clientId : configAuth.facebookAuth.clientID,
	}))
}
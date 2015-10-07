var FacebookStrategy = require('passport-facebook')
  .Strategy;
var User = require('../server/mongoModels/user.js');

//the auth variables
var configAuth = require('./auth.js');

module.exports = function(passport) {
  //setting up sessions for passport.  

  //serialize the user for the session:

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //used to deserialize the user:

  passport.deserializeUser(function(id, done) {
    //User.findById(id, function(err, user){
    // 	done(err, user);
    // })
  })

  passport.use(new FacebookStrategy({
      clientId: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL
    },
    //facebook will send back the token and the profile
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {
        //find the user in the database based on their facebook ID
        User.findOne({
          'facebook.id': profile.id
        }, function(err, data) {
          if (err) return done(err);

          if (user) {
            return done(null, user);
          } else {
            //create the user  if not found
            var newUser = new User();

            // set all of the facebook information in our user model
            newUser.facebook.id = profile.id; // set the users facebook id                   
            newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;

              // if successful, return the new user
              return done(null, newUser);
            });

          }
        })
      })
    }

  ))
}
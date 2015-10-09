var FacebookStrategy = require('passport-facebook')
  .Strategy;
var User = require('../server/mongoModels/user.js');
var TwitterStrategy = require('passport-twitter')
  .Strategy;
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
    User.findById(id, function(err, user) {
      done(err, user);
    })
  })
  ///////TWITTER:
  passport.use(new TwitterStrategy({
      consumerKey: configAuth.twitterAuth.consumerKey,
      consumerSecret: configAuth.twitterAuth.consumerSecret,
      callbackURL: configAuth.twitterAuth.callbackURL,
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, tokenSecret, profile, done) {
      console.log(profile);
      console.log("This is the profile id:", profile.id);
      // asynchronous
      process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {

          User.findOne({
            'twitter.id': profile.id
          }, function(err, user) {
            if (err)
              return done(err);

            if (user) {
              // if there is a user id already but no token (user was linked at one point and then removed)
              if (!user.twitter.token) {
                user.twitter.token = token;
                user.twitter.username = profile.username;
                user.twitter.displayName = profile.displayName;
                user.twitter.photo_url = profile.photos[0].value;
                user.save(function(err) {
                  if (err)
                    return done(err);

                  return done(null, user);
                });
              }

              return done(null, user); // user found, return that user
            } else {
              // if there is no user, create them
              var newUser = new User();

              newUser.twitter.id = profile.id;
              newUser.twitter.token = token;
              newUser.twitter.username = profile.username;
              newUser.twitter.displayName = profile.displayName;
              newUser.twitter.photo_url = profile.photos[0].value;
              newUser.save(function(err) {
                if (err)
                  return done(err);

                return done(null, newUser);
              });
            }
          });

        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          user.twitter.id = profile.id;
          user.twitter.token = token;
          user.twitter.username = profile.username;
          user.twitter.displayName = profile.displayName;
          user.twitter.photo_url = profile.photos[0].value;
          user.save(function(err) {
            if (err)
              return done(err);

            return done(null, user);
          });
        }
    });
  })
);
}

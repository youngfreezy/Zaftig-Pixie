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

          user.save(function(err) {
            if (err)
              return done(err);

            return done(null, user);
          });
        }

      });

    }));
  ///////FACEBOOK:
  passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        enableProof: false,
        profileFields: ['id', 'emails', 'name']
      },



      //facebook will send back the token and the profile
      function(token, refreshToken, profile, done) {
        process.nextTick(function() {
          //find the user in the database based on their facebook ID
          User.findOne({
            'facebook.id': profile.id
          }, function(err, user) {
            if (err) {
              throw err
            }

            if (user) {
              console.log("there is a user already")
              done(null, user);
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
                console.log("successfully saved user into database")
                done(null, newUser);
              });

            }
          })
        })
      }));
}
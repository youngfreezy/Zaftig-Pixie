module.exports = function(app, passport) {
  //HOME PAGE (with login links):

  app.get('/', function(req, res) {
    console.log("------ HIT ME ------");
    console.log('req.user is ', req.user);
    if (req.user.twitter.id) {
      res.send('/' + req.user.twitter.username);
    }
    res.send('/');
  });

  //twitter routes:
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/'
    }));
  //route middleware to make sure that a user is loggedIn yo

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }
    res.redirect('/');
  }
};
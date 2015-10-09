var path = require('path');


module.exports = function(app, passport) {

  //twitter routes:
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/user/' + req.user.twitter.username);
  });

  app.get('/user/:username', function(req, res) {
    console.log("req.session.passport from getting username is", req.session.passport);
    res.sendFile(path.join(__dirname + '/../client/index.html'));
  })

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }
    console.log("user is not logged in redirecting to home route");
    res.redirect('/');
  }
};
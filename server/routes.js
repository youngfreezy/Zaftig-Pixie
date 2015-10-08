module.exports = function(app, passport) {
  //HOME PAGE (with login links):


  app.get('/', isLoggedIn, function(req, res) {
    console.log('req.user is ', req.user);
    res.send('/');
  });

  //LOGIN 

  // app.get('/login', function(req, res) {

  //   //render the page 
  //   res.render('login.ejs', {
  //     message: req.flash('loginMessage')
  //   });
  // })
  app.get('/signup', function(req, res) {

    //render the page 
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });

  });

  app.get('/play', function(req, res) {
    // console.log("in the /get to /profile")
    //render the page 
    console.log('I am in the play callback');
    console.log('The req.user is ', req.user);
    res.send('/', {
      user: req.user //get the user out of the session
      // and pass it to the template. 
    });
    res.redirect('/');
  });

  //FACEBOOK routes!

  app.get('/auth/facebook', passport.authenticate('facebook',
    //specific to the facbeook API. if you want something other than the default
    // you ahve to use the scope property
    {
      scope: ['email']
    }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/'
    }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');

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
    console.log("user is not logged in redirecting to home route");
    res.redirect('/');
  }
};
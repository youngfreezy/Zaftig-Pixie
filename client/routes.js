module.exports = function(app, passport) {
  //HOME PAGE (with login links):

  app.get('/', function(req, res) {
    res.render('index.ejs');
  })

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

  })
  app.get('/profile', function(req, res) {
    // console.log("in the /get to /profile")
    //render the page 
    res.render('profile.ejs', {
      user: req.user //get the user out of the session
      // and pass it to the template. 
    })
  })

  //FACEBOOK routes!

  app.get('/auth/facebook', passport.authenticate('facebook',
    //specific to the facbeook API. if you want something other than the default
    // you ahve to use the scope property
    {
      scope: ['email']
    }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');

  })

  //twitter routes:

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }))
  //route middleware to make sure that a user is loggedIn yo

  // function isLoggedIn(req, res, next) {
  //   if (req.isAuthenticated()) {
  //   next();
  //   }
  //   console.log("user is not logged in redirecting to home route")
  //   res.redirect('/');
  // }
}
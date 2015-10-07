module.exports = function(app, passport) {
  //HOME PAGE (with login links):

  app.get('/', function(req, res) {
    res.render('index.ejs');
  })

  //LOGIN 

  app.get('/login', function(req, res) {

    //render the page 
    res.render('login.ejs', { message: req.flash('loginMessage') }); 
  })
  app.get('/signup', function(req, res) {

    //render the page 
    res.render('signup.ejs', { message: req.flash('signupMessage') });

  })
  app.get('/profile', isLoggedIn, function(req, res) {

    //render the page 
    res.render('profile.ejs', {
    	user: req.user //get the user out of the session
    	// and pass it to the template. 
    })
  })
  app.get('/logout', function(req, res) {
  	req.logout();
  	res.redirect('/');

  })

 

//route middleware to make sure that a user is loggedIn yo

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/');
}
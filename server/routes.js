module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index.html');
	})

	app.get('/login', function(req, res){
		res.render('facebookauthenticate.html')
	})
// // request user data from database
// app.use('/user', handlers.user);

// // login user and create session
// app.use('/login', handlers.login);

// // register a new user to the databse
// app.use('/register', handlers.register);

// // serve passage to the client
// app.use('/text', handlers.text);
}

function isLoggedIn(req, res, next){

	//if user is authenticated, move on

	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/');
}
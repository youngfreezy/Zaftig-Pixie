function isauthenticatedOrNot(req, res, next){
	if(req.isAuthenticated()){
		next();
	} else{
		res.redirect("/login");
	}
}

function userExist(req, res, next){
	Users.count({
		username: req.body.username
	}, function(err, count){
		if(count === 0){
			next();
		} else{
			res.redirect('/signup');
		}
	})
}
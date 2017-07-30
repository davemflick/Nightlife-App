var Searches = require('../models/Searches');
var middleware = {};

middleware.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.session.returnTo = req.url;
	res.redirect('/');
}


module.exports = middleware;
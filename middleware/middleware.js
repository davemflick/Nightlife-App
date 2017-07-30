var Searches = require('../models/Searches');
var middleware = {};

middleware.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	console.log(req.isAuthenticated())
	res.render('loginError');
}


module.exports = middleware;
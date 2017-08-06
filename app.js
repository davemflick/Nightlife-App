//External Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require("passport-local");
var TwitStrategy = require('passport-twitter').Strategy;
var yelp = require('yelp-fusion');

var middleware = require('./middleware/middleware');
var isLoggedIn = middleware.isLoggedIn;

//To get rid of mongoose promise warning
mongoose.Promise = global.Promise;

//Models
var User = require('./models/User');
var Searches = require('./models/Searches');

mongoose.connect('mongodb://localhost/nightlife', {useMongoClient: true}, (err)=>{
	if(err){
		console.log("Error connecting to database, error= " + err);
	} else {
		console.log("Mongoose connected to database");
	}
});

//App Set Up
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Express-session set up
app.use(require("express-session")({
  secret: "My secret message",
  resave: false,
  saveUninitialized: false,
}));

//Set up Method-Override
app.use(methodOverride("_method"));

//TWITTER SET UP
passport.use(new TwitStrategy({
	consumerKey: process.env.TWITTER_KEY,
	consumerSecret: process.env.TWITTER_SECRET,
	callbackURL: 'http://localhost:3000/twitter/return'
}, function(token, tokenSecret, profile, callback){
	return callback(null, profile);
}));

//  function(token, tokenSecret, profile, callback){
// 	return callback(null, profile);
// }));

//Set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, callback){
	callback(null, user);
});
passport.deserializeUser(function(obj, callback){
	callback(null, obj);
});


//Bring routes in from 'routes' directory
var results = require('./routes/results');
app.use(results);
var api = require('./routes/api');
app.use('/api', api);


//ROUTES
app.get('/', function(req, res, next){
	res.render('index', {user: req.user});
});

//middleware to determine if user is logged in or not, pass to every template
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	next();
});

//This api will determine if there is a user logged in.
app.get('/api/user', function(req, res, next){
	if(req.user){
		res.json({user: req.user.username});
	} else {
		res.json({user: 'noUser'});
	}
});

app.put('/add-user/:id/:user/:estab', isLoggedIn, function(req, res, next){
	let id = req.params.id;
	let user = req.params.user;
	let estab = req.params.estab;
	console.log(req.body);
	Searches.findByIdAndUpdate(id, req.body, function(err, foundCity){
		if(err){
			console.log(err);
		} else {
			//console.log('FoundCity = ' + foundCity);
			foundCity.results.forEach((bar,i)=>{
				if(bar.id === estab){
					let people = foundCity.results[i].peopleGoing;
					people.push(req.body.peopleGoing);
					foundCity.results[i].peopleGoing = people;
					Searches.findByIdAndUpdate(id, foundCity, function(err, city){
						if(err){
							console.log(err);
						} else {
							console.log('User added to Going list');
						}
					});
				}
			});
			
			res.redirect('back')
		}
	});
})

//DELETE USER FROM ESTAB PEOPLEGOING LIST

app.put('/remove/:id/:user/:bar', function(req,res,next){
	let id = req.params.id;
	let user = req.params.user;
	let bar = req.params.bar;
	Searches.findById(id, function(err, cityData){
		if(err){
			console.log('ERROR in finding user to delete - ' + err);
			res.redirect('back')
		} else {
			cityData.results.forEach((estab, i)=>{
				if(estab.id === bar){
					let people = []
					estab.peopleGoing.forEach(person=>{
						if(person !== user){
							people.push(person);
						}
					});
					cityData.results[i].peopleGoing = people;
					Searches.findByIdAndUpdate(id, cityData, function(err, city){
						if(err){
							console.log("Error in removing person "+ err)
						} else {
							console.log("User successfully removed from list");
						}
					})
				}
			})
			res.redirect('back');
		}
	});
});


app.get('/failed-login', function(req, res, next){
	res.render('index');
});

app.get('/twitter/login', passport.authenticate('twitter'));

app.get('/twitter/return', passport.authenticate('twitter', {
	failureRedirect: '/failed-login',
}), function(req, res){
	res.redirect('back');
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('back');
})


app.listen(process.env.PORT || 3000, process.env.IP, function(err){
	if(err){
		console.log("FAILED SERVER, APP.LISTEN PROBLEM");
	} else {
		console.log('NIGHTLIFE SERVER UP AND RUNNING');
	}
})
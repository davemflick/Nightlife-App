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

//Bring routes in from 'routes' directory
var results = require('./routes/results');
app.use(results);
var api = require('./routes/api');
app.use('/api', api);

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
}, function(token, tokenSecret, profile, done){
	process.nextTick(function(){
		User.find({'twitter.id' : profile.id}, function(err, user){
			if(err){
				console.log("Error in twitterAuth");
				return done(err);
			}
			if(user){
				return done(null, user);
			} else {
				var createUser = new User();
				createUser.twitter.id = profile.id;
				createUser.twitter.token = token;
				createUser.twitter.username = profile.username;
				createUser.twitter.displayName = profile.displayName;
				User.create(createUser, function(err, newUser){
					if(err){
						console.log("Error in creating new user - " + err)
					} else {
						return done(null, newUser);
					}
				})
			}
		})
	})
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


//middleware to determine if user is logged in or not, pass to every template
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	next();
});

//ROUTES
app.get('/', function(req, res, next){
	res.render('index', {user: req.user});
});

app.get('/twitter/login', passport.authenticate('twitter'));

app.get('/twitter/return', passport.authenticate('twitter', {
	failureRedirect: '/',
	successRedirect: '/'
}), function(req, res){ res.render('index')});


app.listen(process.env.PORT || 3000, process.env.IP, function(err){
	if(err){
		console.log("FAILED SERVER, APP.LISTEN PROBLEM");
	} else {
		console.log('NIGHTLIFE SERVER UP AND RUNNING');
	}
})








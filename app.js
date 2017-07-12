//External Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require("passport-local");
var Twitter = require('passport-twitter');
var yelp = require('yelp-fusion');

//To get rid of mongoose promise warning
mongoose.Promise = global.Promise;

//Models
var User = require('./models/user');

//GET YELP DATA
var token = yelp.accessToken(process.env.YELP_CLIENT_ID, process.env.YELP_CLIENT_SECRET)
				.then((res)=>{
					console.log(res.jsonBody.access_token);
				}).catch((e)=>{console.log('THIS IS ERROR: ' + e)});

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

//Set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to determine if user is logged in or not, pass to every template
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	next();
});

//ROUTES
app.get('/', function(req, res, next){
	res.render('index');
});


app.listen(process.env.PORT || 3000, process.env.IP, function(err){
	if(err){
		console.log("FAILED SERVER, APP.LISTEN PROBLEM");
	} else {
		console.log('NIGHTLIFE SERVER UP AND RUNNING');
	}
})








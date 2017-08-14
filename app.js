//External Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var TwitStrategy = require('passport-twitter').Strategy;
var yelp = require('yelp-fusion');

var middleware = require('./middleware/middleware');
var isLoggedIn = middleware.isLoggedIn;
let currentURL = '/';
//Models
var Searches = require('./models/Searches');


var dbURL = process.env.NIGHTLIFE_APP || 'mongodb://localhost/nightlife';

mongoose.connect(dbURL, {useMongoClient: true}, (err)=>{
	if(err){
		console.log("Error connecting to database, error= " + err);
	} else {
		console.log("Mongoose connected to database");
	}
});


//To get rid of mongoose promise warning
mongoose.Promise = global.Promise;


//Bring routes in from 'routes' directory
var api = require('./routes/api');

//App Set Up
app.use(express.static('public'));
app.set('view engine', 'pug');
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
	callbackURL: 'https://my-nightlife-fcc-app.herokuapp.com/twitter/return'
}, function(token, tokenSecret, profile, callback){
	return callback(null, profile);
}));

//  function(token, tokenSecret, profile, callback){
// 	return callback(null, profile);
// }));

//Set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, callback){
	callback(null, user);
});
passport.deserializeUser(function(obj, callback){
	callback(null, obj);
});

//ROUTES
app.get('/', function(req, res, next){
	currentURL = '/';
	res.render('index', {user: req.user});
});

app.get('/favicon.ico', function(req, res, next){
	res.render('index', {user: req.user});
});

app.get('/results/:id', function(req, res, next){
	currentURL = req.url;
	Searches.find({}, (err, city)=>{
		if(err){
			res.render('error', {error: err})
		} else {
			res.render('index')
		}
	})
});

//On City Search, Run a Yelp API call, return results, create new db record of search.
// Redirect back to results/city
app.post('/search/:id', function(req, res, next){
	var city = req.params.id;
	var cityData;
    yelp.accessToken(process.env.YELP_CLIENT_ID, process.env.YELP_CLIENT_SECRET)
		.then((res)=>{
			var client=yelp.client(res.jsonBody.access_token);
			client.search({
			  location: city,
			  term: 'bar',
			  limit: 10
			}).then(response => {
			  cityData = response.jsonBody.businesses;
			  createCityInstance(city, cityData);
			}).catch(e => {
			  console.log(e);
			});
		}).catch((e)=>{console.log('THIS IS ERROR: ' + e)});
	
	function createCityInstance(location, data){
		var establishments = [];
		data.forEach(est=>{
			var bar = {
				city: location.toLowerCase(),
				id: est.id,
				name: est.name,
				image: est.image_url,
				address: est.location.display_address,
				rating: est.rating,
				price: est.price,
				peopleGoing: [],
				alias: est.categories
			}
			establishments.push(bar);
		});
		var citySearch = {city: location.toLowerCase(), results: establishments}
		Searches.find({city: location.toLowerCase()}, function(err, foundCity){
			if(err){
				console.log("Error at Search.find(citySearch). Err = " + err);
			} else {
				if(foundCity[0]){
					console.log('city found in db')
					res.redirect('/results/' + req.params.id)
				} else {
					console.log("city not found, adding to db");
					Searches.create(citySearch, function(err, city){
						if(err){
							console.log(err)
						} else {
							res.redirect('/results/' + req.params.id);
						}
					});
				}
				
			}
		})
	}
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
	res.redirect(currentURL);
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('back');
})

app.use('/api', api);


app.listen(process.env.PORT || 3000, function(err){
	if(err){
		console.log("FAILED SERVER, APP.LISTEN PROBLEM");
	} else {
		console.log('NIGHTLIFE SERVER UP AND RUNNING');
	}
})


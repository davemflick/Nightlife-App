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

app.get('/:id', function(req, res, next){
	var city = req.params.id;
	res.render('index');
});


app.get('/api/results', function(req, res, next){
	Searches.find({}, (err, city)=>{
		if(err){
			res.render('error', {error: err})
		} else {
			let curDate = new Date()
			let today = findDate(curDate);
			let cities = []
			city.forEach(x=>{
				if(today === findDate(x.timestamp)){
					cities.push(x)
				} else {
					Searches.findByIdAndRemove(x._id, (err)=>{
						if(err){
							console.log(err);
						} else {
							console.log("Deleted Result with Id = " + x.id)
						}
					})
				}
			})
			console.log(cities);
			res.json({city: cities})
		}
	})

	function findDate(date){
		let day = date.getDate();
		let month = date.getMonth();
		let year = date.getFullYear();
		return `${day}/${month}/${year}`
	}
})

app.get('/results/:id', function(req, res, next){
	Searches.find({}, (err, city)=>{
		if(err){
			res.render('error', {error: err})
		} else {
			res.render('index')
		}
	})
})

app.post('/search/:id', function(req, res, next){
	var city = req.params.id;
	var cityData;
    yelp.accessToken(process.env.YELP_CLIENT_ID, process.env.YELP_CLIENT_SECRET)
		.then((res)=>{
			var client=yelp.client(res.jsonBody.access_token);
			client.search({
			  location: city,
			  term: 'bar',
			  limit: 2
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
				id: est.id,
				name: est.name,
				image: est.image_url,
				address: est.location.display_address,
				rating: est.rating,
				price: est.price,
				peopleGoing: 0,
				alias: est.categories
			}
			establishments.push(bar);
		});
		var citySearch = {city: location, results: establishments}
		Searches.create(citySearch, function(err, city){
			if(err){
				console.log(err)
			} else {
				res.redirect('/results/' + req.params.id);
			}
		});
	}
});



app.listen(process.env.PORT || 3000, process.env.IP, function(err){
	if(err){
		console.log("FAILED SERVER, APP.LISTEN PROBLEM");
	} else {
		console.log('NIGHTLIFE SERVER UP AND RUNNING');
	}
})








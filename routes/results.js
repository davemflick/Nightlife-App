var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var yelp = require('yelp-fusion');

//Body-Parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Models
var User = require('../models/User');
var Searches = require('../models/Searches');

router.get('/results/:id', function(req, res, next){
	Searches.find({}, (err, city)=>{
		if(err){
			res.render('error', {error: err})
		} else {
			res.render('index')
		}
	})
})

//On City Search, Run a Yelp API call, return results, create new db record of search.
// Redirect back to results/city
router.post('/search/:id', function(req, res, next){
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
				city: location.toLowerCase(),
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



module.exports = router;
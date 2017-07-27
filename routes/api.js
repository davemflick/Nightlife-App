var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Body-Parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Models
var User = require('../models/User');
var Searches = require('../models/Searches');

//This api gets called by axios in react.. It will return Searches collection.
//If any of the Searches are not from the current day, it will delete them.
//Only return Todays Searches.
router.get('/results', function(req, res, next){
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

router.post('/addUser', function(req, res, next){
	
});


//This api will determine if there is a user logged in.
// router.get('/user', function())


module.exports = router;
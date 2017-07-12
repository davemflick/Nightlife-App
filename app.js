//External Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var Twitter = require('passport-twitter');

//App Set Up
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


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

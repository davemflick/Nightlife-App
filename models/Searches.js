var mongoose = require('mongoose');

var SearchesSchema = new mongoose.Schema({
	city: String,
	results: {type:Array, default: []},
	timestamp: {type:Date, default:Date.now}
})

module.exports = mongoose.model('Searches', SearchesSchema);
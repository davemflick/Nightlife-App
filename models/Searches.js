import mongoose from 'mongoose';

var SearchesSchema = new mongoose.Schema({
	city: String,
	results: {type:Array, default: []}
	timeStamp: {type:Date, default:Date.now}
})

module.exports = mongoose.model('Searches', SearchesSchema);
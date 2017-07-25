var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	twitter: {
		id: String,
		token: String,
		displayName: String,
		username: String
	},
	searches: {type:Array, default: []},
	going: {type:Array, default: []},
	timestamp: {type:Date, default: Date.now}
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: false,
		trim: true
	},

	password: String,	
	
	email: {
		type: String,
		unique: true,
		trim: true,
		required: true
	},

	orders: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order"
	}]

});

UserSchema.plugin(passportLocalMongoose);

module.exports = UserSchema;
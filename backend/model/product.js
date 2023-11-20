var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
	img: String,
    label: String,
    price: Number    
});
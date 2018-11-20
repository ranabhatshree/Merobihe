const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const photoSchema = new Schema({
	caption: {
		type: String,
    default:null,
		required:false,
	},
  pic:{
    type: String,
		required:true,
  },
  userId:{
    type: String,
    required:true,
  },
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

//exporting
module.exports = mongoose.model('Photo',photoSchema);

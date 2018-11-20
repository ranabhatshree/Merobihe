const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const userSchema = new Schema({
	_id:mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required:true
	},
	email: {
	 type: String,
	 required:true,
	 unique:true,
	 match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {
		type: String,
		required:true
	},
	age:{
		type:Number,
		required:true,
		default:null,
	},
	gender:{
		type:String,
		required:true,
		default:null,
	},
	address:{
		 type: String,
		 required:true,
		 default:null
	 },
	 hobbies:{
		 type:[String],
		 default:null,
		 required:false
	 },
	 phone:{
		 type:String,
		 required:false,
		 default:null
	 },
	 profile_pic:{
		 type:String,
		 required:false,
		 default:null
	},
	is_siteadmin:{
		type:Boolean,
		default:false
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
module.exports = mongoose.model('User',userSchema);

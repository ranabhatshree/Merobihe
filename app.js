const express = require('express');
const app = express();
const morgan = require('morgan'); //include morgan
const bodyParser = require('body-parser'); //include body-parser
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');
const photoRoutes = require('./api/routes/photo');

mongoose.connect("mongodb://localhost/merobihe",{
  useNewUrlParser:true
});

mongoose.Promise = global.Promise;  //for mongodb new version

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//give access to all clients
app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','*');

	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
		return res.status(200).json({});
	}

	next();

});

//Routes which should handle request
app.use('/api',userRoutes);
app.use('/api',photoRoutes);

app.use(function(req,res,next){

	const error = new Error('Not found.');
	error.status(400);
	next(error);

});

app.use(function(error,req,res,next){

	res.status(error.status  || 500);
	res.json({
		error:{
			message:error.message
		}
	});

});

module.exports = app;

const jwt = require('jsonwebtoken');
const JWT_KEY = 'secret';

var checkAuth = function(req,res,next){
	try{
		const token = req.headers.authorization;
		const decoded = jwt.verify(token, JWT_KEY);
		req.userData = decoded;
		next();

	}catch(error){
		return res.status(401).json({
			message:'Unauthorized access.'
		})
	}
}

var isSiteAdmin = function(req,res,next){
	try{
		const siteadmin_pass = req.headers.siteadmin_pass;
		if(siteadmin_pass === 'merobihe1234567890'){
			next();
		}
		else{
			return res.status(401).json({
				message:"Unauthorized access"
			})
		}

	}catch(error){
		return res.status(401).json({
			message:'Unauthorized access.'
		})
	}
}

module.exports = {
	checkAuth,
	isSiteAdmin
}

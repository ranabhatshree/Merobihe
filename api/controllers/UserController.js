const mongoose = require("mongoose");
const bcrypt = require('bcrypt'); //password bcryption
const jwt = require('jsonwebtoken'); //json - web -token
const JWT_KEY = 'secret';

const User = require("../models/user");

exports.register = function(req,res,next){

	//if user already exists
	User.find({email:req.body.email})
	  .exec()
	  .then(user =>{
	    if(user.length>0){
	      return res.status(409).json({
	        'message':'E-mail already exists'
	      })
	    }else
	    {
	      //hash password
	      bcrypt.hash(req.body.password, 10, function(err,hash){
	        if(err) {
	          res.status(500).json({
	            error:err
	          })
	        }
	        else{
	          const user = new User({
	            _id: mongoose.Types.ObjectId(),
	            name: req.body.name,
	            email: req.body.email,
	            password:hash,
	            age:req.body.age,
	            gender:req.body.gender,
	            address:req.body.address
	          });

	          //store in db
	          //use json web token
	        const token	= jwt.sign({
	            email:req.body.email,
	            userId:mongoose.Types.ObjectId(),
	          },
	          JWT_KEY,
	          {
	            expiresIn:"24h"
	          });

	          //saving user
	          user
	          .save()
	          .then(result=>{

	            //RECOMMENDED USERS
	            User.find({
	              "_id":{
	                $ne:user._id
	              },
	              "gender":{
	                $ne:user.gender
	              }
	            })
	            .select('-password -__v -is_siteadmin')
	            .exec()
	            .then(recommendedUsers=>{

	              res.status(201).json({
	                'message':'User created success',
	                token:token,
	                user:result,
	                recommendedUsers:recommendedUsers
	              })

	            })
	            .catch(err=>{
	              res.status(500).json({
	                error:err
	              })
	            })

	          })
	          .catch(err=>{
	            res.status(500).json({
	              error:err
	            })
	          });


	        }
	      }); //end bycrypt

	    } //end else
	  })
	  .catch(err=>{
	    res.status(500).json({
	      error:err
	    })
	  });

}

exports.login = function(req,res,next){

	User.find({email:req.body.email})
		.exec()
		.then(user=>{
			if(user.length>0){ //if email exists
				//check for password
				bcrypt.compare(req.body.password, user[0].password, function(err,result){

					//if valid password
					if(result){

						//use json web token
					const token	= jwt.sign({
							email:user[0].email,
							userId:user[0]._id,
						},
						JWT_KEY,
						{
							expiresIn:"24h"
						});

						//RECOMMENDED USERS
						User.find({
							"_id":{
								$ne:user[0]._id
							},
							"gender":{
								$ne:user[0].gender
							}
						})
						.select('-password -__v -is_siteadmin')
						.exec()
						.then(results=>{

							return res.status(200).json({
								message:'Success',
								token:token,
								user:user,
								recommendedUsers:results
							});

						})
						.catch(err=>{
							return err
						})


					}else{
						return res.status(401).json({
							message:'Incorrect Password'
						});
					}

					if(err){
						return res.status(401).json({
							message:err
						});
					}

				});

			}else
			{
				res.status(401).json({
					message:'Incorrect E-mail Address'
				});
			}
		})
		.catch(err=>{
			res.status(500).json({
				error:err
			})
		});

}

exports.get_all_users = function(req,res,next){

	User.find({})
		.select('-password -__v -is_siteadmin')
		.sort({createdAt: 'desc'})
		.exec()
		.then( users=>{
			res.status(200).json({
				count:users.length,
				users:users,
				title:'All users',
				description:'All registered users will appear here',
			})
		})
		.catch(err=>{
			res.status(500).json({
				error:err
			})
		});

}

exports.getSingleUser = function(req,res,next){

	User.findById(req.params.userId)
		.select('-password -__v -is_siteadmin')
		.exec()
		.then(user=>{
			if(user){
				res.status(200).json({
					user:user
				})
			}
			else{
				res.status(400).json({
					message:'User not found'
				})
			}

		})
		.catch(err=>{
			res.status(500).json({
				error:err
			})
		});
}

exports.deleteUser = function(req,res,next){

	//remove
	User.remove({_id:req.params.userId})
		.exec()
		.then(result=>{
			res.status(200).json({
				message:'User deleted success'
			})
		})
		.catch(err=>{
			res.status(500).json({
				error:err
			})
		});

}

exports.searchUser = function(req,res,next){

	const queries = Object.entries(req.query)	//split into array of keys and values
	var search_query = new Object()

	for (const [key, value] of queries) {

		if(key == 'min_age'){
			search_query["age"] = {
				$lte:parseInt(value),
			}
		}else if(key == 'max_age'){
			search_query["age"] = {
				$gte:parseInt(value),
			}
		}
		else if(key == 'gender'){
			search_query[key] = value
		}
		else{
			search_query[key] = {
				'$regex':value,
				'$options':'i'
			}
		}

	}

	User.find(search_query)
			.select('-password -__v -is_siteadmin')
			.exec()
			.then(results=>{
				res.status(200).json({
					count:results.length,
					results:results
				})
			})
			.catch(err=>{
				res.status(500).json({
					error:err
				})
			})

}

exports.update_user = function(req,res,next){

	User.findByIdAndUpdate({_id:req.params.userId}, req.body)
      .then(function(){
            User.findOne({_id:req.params.userId})
								.select('-password -__v -is_siteadmin')
								.exec()
                .then(user=>{
                  res.status(200).json({
                    'message':'User updated success',
                    user:user
                  })
                })
                .catch(err=>{
									res.status(500).json({
										error:err
									})
								})
          })
					.catch(err=>{
						res.status(500).json({
							error:err
						})
					})

}

exports.update_profile_pic = function(req,res,next){

	User.update({_id:req.params.userId},{profile_pic:req.file.path})
			.then(user=>{

				//getting updated doc
				User.find({_id:req.params.userId})
						.select('-password -__v ')
						.then(result=>{
							res.status(200).json({
								message:"Profile pic updated success",
								user:result
							})
						}).catch(err=>{
							res.status(500).json({
								error:err
							})
						})
			})
			.catch(err=>{
				res.status(500).json({
					error:err
				})
			})

}

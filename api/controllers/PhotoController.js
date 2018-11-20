const mongoose = require("mongoose");
const bcrypt = require('bcrypt'); //password bcryption
const jwt = require('jsonwebtoken'); //json - web -token
const JWT_KEY = 'secret';

const Photo = require("../models/photo");

exports.uploadPhoto = function(req,res,next){

const photo = new Photo({
    caption:req.body.caption,
    pic:req.file.path,
    userId:req.params.userId
});

photo.save()
      .then(result=>{
        res.status(200).json({
          message:'Photo uploaded success.',
          result:result
        })
      })
      .catch(next);
}

exports.getUserPhotos = function(req,res,next){

  Photo.find({userId:req.params.userId})
        .exec()
        .then(photos=>{
          res.status(200).json({
            photos:photos
          })
        })
        .catch(next);

}

exports.getSinglePhoto = function(req,res,next){

  Photo.find({photoId:req.params.photoId})
        .exec()
        .then(photo=>{
          res.status(200).json({
            photo:photo
          })
        })
        .catch(next);

}

exports.deletePhoto = function(req,res,next){

  Photo.find({_id:req.params.photoId})
        .exec()
        .then(photo=>{

          if(photo.length>0){

            //remove
            Photo.remove({_id:req.params.photoId})
                  .then(result=>{
                    res.status(200).json({
                      message:'Photo Deleted Success'
                    })
                  })
                  .catch(next);

          }else{
            res.status(500).json({
              message:'Photo Id not found.'
            })
          }

        })
        .catch(next);

}

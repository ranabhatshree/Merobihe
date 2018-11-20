const express = require("express");
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./photos');
  },
  filename:function(req, file, cb){
    cb(null, Date.now() + file.originalname );
  }
});

const fileFilter = function(req,file,cb){

  //reject a file .. only accepts image with jpg,png,jpeg,webp,svg

  if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){

    cb(null,true);

  }else{

    cb(new Error('Only Images allowed.'),false);

  }

};

const upload = multer({
  storage:storage,
  fileFilter:fileFilter
}); // destination of uploading

const PhotoController = require('../controllers/PhotoController');

router.post('/user/uploadPhoto/:userId', auth.checkAuth, upload.single('pic'), PhotoController.uploadPhoto);

router.get('/user/photos/:userId', PhotoController.getUserPhotos);

router.get('/user/photo/:photoId', PhotoController.getSinglePhoto);

router.delete('/user/photo/:photoId', auth.checkAuth, PhotoController.deletePhoto);

module.exports = router;

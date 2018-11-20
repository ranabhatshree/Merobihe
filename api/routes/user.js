const express = require("express");
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./uploads');
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

const UserController = require('../controllers/UserController');

router.post('/user/register', UserController.register);

router.post('/user/login', UserController.login);

router.get('/users',UserController.get_all_users);

router.get('/user/:userId',UserController.getSingleUser);

router.patch('/user/updateInfo/:userId', auth.checkAuth, UserController.update_user);

router.patch('/user/updateProfilePic/:userId', auth.checkAuth, upload.single('profile_pic'), UserController.update_profile_pic);

router.delete('/user/:userId', auth.isSiteAdmin, UserController.deleteUser);

router.get('/search',UserController.searchUser);

module.exports = router;

var express = require('express');
var router = express.Router();
const session = require('express-session');
const config = require('../config/config');
var usercontroller = require('../controller/usercontroller');
const auth = require('../middleware/auth');
const cookieAuth = require('../middleware/cookieAuth');
const bodyParser= require('body-parser')
var port = process.env.PORT || 5000;
var app = express();

router.use(session({secret:config.sessionSecret}));
/* GET home page. */

//Crud opration 
router.get('/',auth.isLogin,usercontroller.showall);
router.get('/create',auth.isLogin, function(req, res, next) {
  res.render('create');
});
router.post('/createData',auth.isLogin,usercontroller.insertData);
router.get('/edit',auth.isLogin, usercontroller.editUser);
router.post('/updateuser',auth.isLogin, usercontroller.updateUser);
router.get('/deleteuser',auth.isLogin, usercontroller.deleteUser);


// Login user
router.get('/login',auth.isLogout, function(req, res){
  res.render('login');
});
router.post('/loginuser',cookieAuth.cookieset,usercontroller.loginUser);

//Logout user
router.get('/logout',auth.isLogin,usercontroller.Logout);



//Register user
router.post('/registeruser',auth.isLogout, usercontroller.registerUser);
router.get('/register',auth.isLogout, function(req, res){
  res.render('register');
});

// forget password
router.get('/forgot',auth.isLogout, function(req, res){
  res.render('forget');
});
// router.post('/forgetuser',auth.isLogout, usercontroller.forgetUser);
router.post('/forgetuser', usercontroller.forgetVerify);
router.get('/forget-password',auth.isLogout,usercontroller.forgetPassword);
router.post('/reset-password',auth.isLogout,usercontroller.resetPassword);


//chat with friends
router.get('/message',function(req,res){
  res.render('chat');
})

// index
router.get('/index', (req, res) => {    
  res.render('index')
})

//enter room

//Rooms
router.get('/room', (req, res)=>{
  res.render('room')
})

//Get username and roomname from form and pass it to room
router.post('/room', (req, res) => {
  roomname = req.body.roomname;
  username = req.body.username;
  res.redirect(`/room?username=${username}&roomname=${roomname}`)
})



module.exports = router;

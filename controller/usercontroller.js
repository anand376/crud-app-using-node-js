const express = require('express')
const bodyParser= require('body-parser')
const Userlist = require('../models/userlist');
const users = require('../models/users');
const nodemailer = require("nodemailer");
const rendomstring = require('randomstring');
const config = require('../config/config');



const insertData = async(req, res)=>{
    try {
        const { name, email, phone, subject} = req.body;
        const userlist = new Userlist({
            name : name,
            email : email,
            phone : phone,
            subject : subject,
          });

          const result = await userlist.save();
          userlist.save().then(res.redirect('/')).catch((err) => console.log(err));
    } catch (error) {
        res.send(error.message);
    }

}

const showall = async(req, res)=>{
    try {
        const getall = await Userlist.find({});
        res.render('dashboard',{getall:getall});
        
    } catch (error) {
        res.send(error.message);
        
    }
}
const editUser = async(req, res)=>{
    try {
       const id = req.query.id;
       const userid = await Userlist.findById({_id:id});
      res.render('editView',{users:userid})
        
    } catch (error) {
        res.send(error.message);
        
    }
}

const updateUser = async(req, res)=>{
    try {
        console.log(req.body);    
        const { id, name, email, phone} = req.body;
        const userid = await Userlist.findByIdAndUpdate({_id:id},{$set:{name:name,email:email,phone:phone}});
       res.redirect('/');
    } catch (error) {
        
    }
}

const deleteUser =  async(req,res)=>{
    const id = req.query.id;
    const user = await Userlist.findByIdAndDelete({_id:id});
    res.redirect('/');
}

const registerUser = async(req,res)=>{
    try {
        const { name, email, password} = req.body;
        const usersdata = new users({
            name : name,
            email : email,
            password : password,
          });

          const result = await usersdata.save();
          usersdata.save().then(res.redirect('/')).catch((err) => console.log(err));
    } catch (error) {
        
    }
}

const loginUser = async(req,res)=>{
    const {email ,password} = req.body;
    const userinfo = await users.findOne({email:email});
    console.log(userinfo);
    if(userinfo){
        if(userinfo.password == password){
        req.session.user_id = userinfo._id;
            res.redirect('/');
        }else{
            res.render('login',{message:"username and password incorrect"});
        }
    }else{
        res.render('login',{message:"username and password incorrect"});
    }
    // userinfo.forEach(user => {
    //     if(user.email == email && user.password == password){
    //         req.session.user_id = user._id;
    //         res.redirect('/');
    //     }else{
    //         res.render('login',{message:"username and password incorrect"});
    //     }
    // });
  
   
}

const Logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.clearCookie("cookieName");
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}

// const forgetUser = async(req,res)=>{
//     try {
        
//     } catch (error) {
        
//     }
// }

const forgetVerify = async(req,res)=>{
    try {
        const email = req.body.email;
        const user = await users.findOne({email:email});
        console.log(user);
        if(user){
           const rendomString = rendomstring.generate();
          const updateData = await users.updateOne({email:email},{$set:{token:rendomString}});
          sendResetPasswordMail(user.name,user.email,rendomString);
          res.render('forget',{message:"Please check your mail to reset your password"});
        }else{
            res.render('forget',{message:"User Email is Incorrect"});
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const sendResetPasswordMail =  async(name , email, token)=>{
    try {
        console.log(email);
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            post:587,
            secure: false,
            auth: {
                user: config.emailUser, // generated ethereal user
                pass: config.emailPassword, // generated ethereal password
              },
              logger: true,
              debug: true
        });

        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'for reset password',
          
            html:'<p>hi '+name+', please click here to <a href="http://127.0.0.1:5000/forget-password?token='+token+'"> Reset </a> your password.</p>'
        }
        console.log(mailOptions);

        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }else{
                console.log('Email has been sent:-',info.response);
            }
        })
             
    } catch (error) {
        console.log(error.message);
    }
}

const forgetPassword = async(req,res)=>{
    try {
        const token = req.query.token;
      const user = await users.findOne({token:token});
      if(user){
        res.render('forget-password',{user_id:user._id});
      }else{
        res.render('404',{message:"Page Not Found"})
      }
        
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async(req,res)=>{
    try {
        const id = req.body.user_id;
        const user = await users.findByIdAndUpdate({_id:id},{$set:{password:req.body.password}});
        if(user){
            res.render('login',{success_message:"Password updated try to login"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

// const createData = (req, res) => {
//     const { name, email, phone, subject} = req.body;
//     console.log(name)
//     console.log(email)
//     console.log(phone)
//     console.log(subject)
//     console.log(userlist);
//     console.log(user);

//     const newUser = new Userlist({
//         name : name,
//         email : email,
//         phone : phone,
//         subject : subject,
//       });

//       newUser.save().then(res.redirect("/"))
//       .catch((err) => console.log(err));
     
// }
// const test = (req, res) => {
//     res.send('hello');
//  }

module.exports = {
    insertData,
    showall,
    editUser,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    Logout,
    // forgetUser,
    forgetVerify,
    forgetPassword,
    resetPassword
};

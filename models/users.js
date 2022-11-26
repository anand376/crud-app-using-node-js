const mongoose = require("mongoose");


  
  const  users = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    token:String 
  });
  //const userlistmodel = mongoose.model('userlist',userlistschema);

module.exports = mongoose.model('users',users);
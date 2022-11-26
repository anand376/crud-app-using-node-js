const mongoose = require("mongoose");


  
  const  userlistschema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    subject:String,

  });
  //const userlistmodel = mongoose.model('userlist',userlistschema);

module.exports = mongoose.model('userlist',userlistschema);
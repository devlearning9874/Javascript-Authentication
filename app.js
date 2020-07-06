//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption"); // used before hash encryption
//const md5 = require('md5');  //used before bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
//user schema
const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});  // used for mongoose encryption
//use schema plugin before user model
//To encrypt other filed comma after password and add.
//user model
const User = new mongoose.model("User", userSchema);


app.get("/",function(req, res){
   res.render("home");
});

app.get("/login",function(req, res){
    res.render("login");
 });

 app.get("/register",function(req, res){
    res.render("register");
 });
//post register
app.post("/register",function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.

      const newUser = new User({
          email: req.body.username,
        //  password:md5(req.body.password)   //md5 here used for to hash password
        password: hash
      });
      newUser.save(function(err){
          if(err){
              console.log("Something Wrong!");
          }
          else{
              res.render("secrets");
          }
      });
  });

});
//post login
app.post("/login", function(req,res){
const username = req.body.username;
const password = req.body.password;
User.findOne({email:username}, function(err, foundUser){
if(err){
    console.log(err);
}else{
    if(foundUser){
        // if(foundUser.password === password){
        //     res.render("secrets");
        // }
        // Load hash from your password DB.
bcrypt.compare(password, foundUser.password, function(err, result) {
    // result == true
    if (result == true){
      res.render("secrets");
    }
});
    }
}
});
});


app.listen(3000, function(){
    console.log("Server is running on port 3000")
});

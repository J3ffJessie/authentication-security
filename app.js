//jshint esversion:6
//dependencies for this project to function correctly
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");


const app = express();



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//creating the Schema or fields for the DB that will store this informaton
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// //basic level encryption with basic encryption using provided secret key



//creating the model for our usage to gather the data for the DB
const User = new mongoose.model("User", userSchema);


app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function(req, res){
//creates a new user in the DB by the register form  
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
//saves the new user information in the DB for future reference. If successfully saved, they have access to the secrets page, if not the error is logged as to why not
  newUser.save(function(err){
    if(err){
      console.log(err)
    }else {
      res.render("secrets");
    }
  });
});


app.post("/login", function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password);


  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else{
      if (foundUser.password === password) {
        res.render("secrets");
      }
    }
  });
});







app.listen(3000, function () {
  console.log("Server has started on Port 3000");
});
//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const app=express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");



app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view-engine","ejs");

mongoose.connect("mongodb://localhost:27017/secretsDB",{useNewUrlParser:true},{useUnifiedTopology:true});

const userSchema= new mongoose.Schema({
  email: String,
  password: String
});

const secret= "Thisismylittlesecret.";

userSchema.plugin(encrypt,{secret : process.env.SECRET,encryptedFields: ["password"]});

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home.ejs");
});

app.get("/login",function(req,res){
  res.render("login.ejs");
});

app.get("/register",function(req,res){
  res.render("register.ejs");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password : req.body.password
  });
  newUser.save();
  res.render("secrets.ejs");
});

app.post("/login",function(req,res){
  const userName = req.body.username;
  User.findOne({email : userName}, function(err,foundUser){
    if(err){
      console.log(err);
    }else {
      if(foundUser){
        if(foundUser.password === req.body.password)
        {
          res.render("secrets.ejs");
        }
      }
    }
  });
});

app.listen(3000,function(){
  console.log("Sever started on port 3000");
});

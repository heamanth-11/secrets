require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const md5 = require("md5");
const session = require("express-session");
const passport = require("passport");
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = mongoose.Schema({Email:String,Password:String});
const User = new mongoose.model("User",userSchema);
app.listen("3000",function(){
    console.log("server started in port 3000");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/",function(req,res){
    res.render("home");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        Email:req.body.username,
        Password:md5(req.body.password)
    });
        newUser.save(function(err){
            if(!err){
                res.render("secrets");
            }else{
                res.send(err);
            }
        })
});
app.post("/login",function(req,res){
    const email = req.body.username;
    const pwd = md5(req.body.password);
    User.findOne({Email:email},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result)
            {    
                if(result.Password === pwd)
                {
                    res.render("secrets");
                }
               
            }
        }
    });
});

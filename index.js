var express = require("express");
var mongoose = require("mongoose");
var passport = require('passport')
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var routes = require("./routes"); //puts all your routes in another place 
var setUpPassport= require('./setuppassport') 
var app = express();
setUpPassport();
app.use(session({    //required to use passport.js 
    secret: "just",
    resave: true,
    saveUninitialized: true
   }));
   app.use(flash()); //
   app.use(passport.initialize())
   app.use(passport.session())
mongoose.connect("mongodb://localhost:27017/test"); //connecting to the database
app.set("port", process.env.PORT || 8000); //making a port 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false })); //getting data from the html5 form
app.use(cookieParser());


app.use(routes); // using routes module 
app.listen(app.get("port"), function() {
 console.log("Server started on port " + app.get("port"));
});
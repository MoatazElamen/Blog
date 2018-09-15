

const express = require("express")
const passport = require('passport')
const User = require('./models/user')
const bodyParser=require('body-parser')
var router= express.Router()
router.use(bodyParser.urlencoded({extended:false}))
router.use((req,res,next)=>{
    res.locals.currentUser =req.user;  //Sets useful variables for your templates
    res.locals.errors=req.flash('error')
    res.locals.infos=req.flash('info')
    next()
});

router.get('/',(req,res,next)=>{  //Queries the user collection ,returning the newest users 1st 
    User.find()                               
    .sort({createdAt:'descending'})
    .exec((err,users)=>{
        if(err){
            return next(err)
        }
        res.render('home',{users:users})
    })
})

router.get("/signup", function(req, res) {
 res.render("signup");
});
router.get('/login',(req,res)=>{
    res.render('login')
})
router.post("/login", passport.authenticate("login", {   // authenticating the user 
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
   }));
router.get('/logout',(req,res)=>{  // i don't know what user logout method is !
    req.logout()
    res.redirect('/')
})
router.get('/edit',ensureAuthenticated,(req,res)=>{
    res.render('edit')
})
router.post('/edit',ensureAuthenticated,(req,res,next)=>{   
    req.user.displayName=req.body.displayName;
    req.user.bio=req.body.bio
    req.user.save((err)=>{
        if(err){next(err) 
        return;}
    req.flash('info','profile updated!')
    res.redirect('/edit')
    })
})
function  ensureAuthenticated(req,res,next){   // making sure that the user still authenticated otherwise will display a 'you must log in to see this page'
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('info','you must be logged in to see this page')
        res.redirect('/login')}}
router.post("/signup", function(req, res, next) {
 var username = req.body.username;
 var password = req.body.password;
 User.findOne({ username: username }, function(err, user) { //searching to make sure if the user already exists or not .. if exists reply with a message 
 if (err) { return next(err); }
 if (user) {
 req.flash("error", "User already exists");
 return res.redirect("/signup");
 }
 var newUser = new User({ //making a variable called newUser stores the data coming from the form 
 username: username,
 password: password,
 });
 newUser.save(next);
 });
}, passport.authenticate("login", {
 successRedirect: "/",
 failureRedirect: "/signup",
 failureFlash: true, 
}));

router.get("/user/:username", function(req, res, next) { //making a profile page
    User.findOne({ username: req.params.username }, function(err, user) {  //select*from users when username=req.params.username 
    if (err) { return next(err); }
    if (!user) { res.render('404') }
    res.render('profile',{user: user })
    });
   });
   


module.exports= router;
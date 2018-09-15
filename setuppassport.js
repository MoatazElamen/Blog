var passport = require('passport')
var User = require('./models/user')
var LocalStrategy = require("passport-local").Strategy;
module.exports=()=>{
    passport.serializeUser((user,done)=>{ //need to know what is that
        done(null,user._id)
 })
    passport.deserializeUser((id,done)=>{ // same!
        User.findById(id,function(err,user){
            done(err,user)
        })
        
    })
    passport.use("login", new LocalStrategy( // defining strategy 
         function(username, password, done) {
         User.findOne({ username: username }, function(err, user) {
         if (err) { return done(err); }
         if (!user) {
         return done(null, false,
          { message: "No user has that username!" });
         }
         user.checkPassword(password, function(err, isMatch) {
         if (err) { return done(err); }
         if (isMatch) {
         return done(null, user);
         } else {
         return done(null, false,
          { message: "Invalid password." });
         }
         });
         });
        }));
}
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;
var userSchema = mongoose.Schema({ //creating the table
 username: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 createdAt: { type: Date, default: Date.now },
 displayName: String,
 bio: String
});
userSchema.methods.name = function() { //defining a method for schema!
    return this.displayName || this.username;
   };
   
var noop = function() {}; //a do nothing function to get used by bcrypt
userSchema.pre("save", function(done) { //Define function that runs before model is saved
 var user = this; //save the refrence to the user
 if (!user.isModified("password")) {  // ignored if user password didn't modified 
 return done();
 }
 bcrypt.genSalt(SALT_FACTOR, function(err, salt) { //generating a salt for hash ,and calls the function once it completed
 if (err) { return done(err); }
 bcrypt.hash(user.password, salt, noop,
 function(err, hashedPassword) {
 if (err) { return done(err); }
 user.password = hashedPassword; //Stores the passord and continous with the saving
 done();
 });
 });
});
userSchema.methods.checkPassword = function(guess, done) {     //creating anothe method for password checking
    bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
    });
   };
   var User = mongoose.model("User", userSchema);  //?
module.exports = User; //exporting the table
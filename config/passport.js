const passport = require("passport");
const LocalStrategy=require('passport-local');
const user = require("../models/user");
passport.use('user',new LocalStrategy(function authenticate(username,password,done){
    user.findOne()
} ))
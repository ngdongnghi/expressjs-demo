var jwt = require('jsonwebtoken');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var Users = require('../models/user');

require('dotenv').config();

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, process.env.TOKEN_SECRET,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

exports.jwtPassport = passport.use( new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('JWT Payload: ', jwt_payload);
    Users.findOne({ _id: jwt_payload._id }, (err, user) => {
        if(err) {
            return done(err, false);
        }         
        else if(user) {
            return done(null, user);
        }           
        else {
            return done(null, false);
        }     
    });
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});
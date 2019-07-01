let passport = require('passport');
let FacebookStrategy = require('passport-facebook').Strategy;
let config = require('./config.js');

passport.use('facebook', new FacebookStrategy({
    clientID        : config.facebook.clientID,
    clientSecret    : config.facebook.clientSecret,
    callbackURL     : config.facebook.callbackURL,
    profileFields: ['id', 'emails', 'name']
}));
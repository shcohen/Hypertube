let passport = require('passport');
const User = require('../models/user'); // load up the user model
let FacebookStrategy = require('passport-facebook').Strategy;
let config = require('./config.js');

// add auto creating username because it is not provided with facebook

passport.use('facebook', new FacebookStrategy({
    clientID        : config.facebook.clientID,
    clientSecret    : config.facebook.clientSecret,
    callbackURL     : config.facebook.callbackURL,
    profileFields: ['id', 'email', 'name', 'profile_pic']
},
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

// app.get('/auth/facebook',
//   passport.authenticate('facebook'));
//
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });
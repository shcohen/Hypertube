let passport = require('passport');
// const User = require('../models/user'); // load up the user model

// add auto creating username because it is not provided with facebook
module.exports = {
    google: (req, res, next) => { // load login window
        passport.authenticate('google', {
            scope: ['email', 'profile', 'openid'],
            successRedirect: '/home',
            failureRedirect: '/api/account/google',
            failureFlash: true
        })(req, res, next)
    },
    googleRedirect: (req, res, next) => { // load data
        console.log('been there');
        passport.authenticate('google', {
            scope: ['email', 'profile', 'openid'],
            successRedirect: '/home',
            failureRedirect: '/api/account/google',
            failureFlash: true
        })(req, res, next)
    }
};

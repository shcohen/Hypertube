let passport = require('passport');

module.exports = {
    google: (req, res, next) => { // load login window
        passport.authenticate('google', {
            scope: ['email', 'profile', 'openid']
        })(req, res, next)
    },
    googleRedirect: (req, res, next) => { // load data
        console.log('been there');
        passport.authenticate('google', {
            successRedirect: '/', // if user already exists --> get logged in
            failureRedirect: '/api/account/register', // if user is created
            failureFlash: true
        })(req, res, next)
    },
    github: (req, res, next) => { // load login window
        passport.authenticate('github', {
            scope: ['read:user', 'user:email']
        })(req, res, next)
    },
    githubRedirect: (req, res, next) => { // load data
        console.log('been there');
        passport.authenticate('github', {
            successRedirect: '/', // if user already exists --> get logged in
            failureRedirect: '/api/account/register', // if user is created
            failureFlash: true
        })(req, res, next)
    },
};

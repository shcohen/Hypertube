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
            successRedirect: '/home', // if user already exists --> get logged in
            failureRedirect: '/home', // if user is created
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
            successRedirect: '/home', // if user already exists --> get logged in
            failureRedirect: '/home', // if user is created
            failureFlash: true
        })(req, res, next)
    },
    fortyTwo: (req, res, next) => { // load login window
        passport.authenticate('42')(req, res, next)
    },
    fortyTwoRedirect: (req, res, next) => { // load data
        console.log('been there');
        passport.authenticate('42', {
            successRedirect: '/home', // if user already exists --> get logged in
            failureRedirect: '/home', // if user is created
            failureFlash: true
        })(req, res, next)
    }
};

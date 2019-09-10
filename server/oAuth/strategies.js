let passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = {
    google: (req, res, next) => { // load login window
        passport.authenticate('google', {
            scope: ['email', 'profile', 'openid']
        })(req, res, next)
    },
    googleRedirect: (req, res, next) => { // load data
        console.log('been there');
        passport.authenticate('google', {
            successRedirect: 'http://localhost:5000/api/jwt',
            failureRedirect: 'http://localhost:5000/api/account/google',
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
            successRedirect: 'http://localhost:5000/api/jwt',
            failureRedirect: 'http://localhost:5000/api/account/github',
            failureFlash: true
        })(req, res, next);
    },
    fortyTwo: (req, res, next) => { // load login window
        passport.authenticate('42')(req, res, next)
    },
    fortyTwoRedirect: (req, res, next) => { // load data
        console.log('been there');
        passport.authenticate('42', {
            successRedirect: 'http://localhost:5000/api/jwt',
            failureRedirect: 'http://localhost:5000/api/account/42',
            failureFlash: true
        })(req, res, next)
    },
    jwt: (req, res, next) => {
        if (req && req.user) {
            const payload = {
                acc_id: req.user.acc_id
            };
            jwt.sign(payload, 'hypertube', {expiresIn: "1d"}, (err, token) => {
                console.log(token);
                console.log(err);
                console.log(req.user);
                console.log(typeof req.user);
                res.cookie('jwtToken', token, {
                    maxAge: 1000 * 60 * 60 * 24
                });
                res.redirect('http://localhost:3000');
            });
        } else {
            res.redirect('http://localhost:3000');
        }
    }
};
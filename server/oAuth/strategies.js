let passport = require('passport');
<<<<<<< HEAD
=======
const jwt = require('jsonwebtoken');
>>>>>>> fk-dev

module.exports = {
    google: (req, res, next) => { // load login window
        passport.authenticate('google', {
            scope: ['email', 'profile', 'openid']
        })(req, res, next)
    },
    googleRedirect: (req, res, next) => { // load data
        console.log('been there');
        passport.authenticate('google', {
<<<<<<< HEAD
            successRedirect: '/', // if user already exists --> get logged in
            failureRedirect: '/api/account/register', // if user is created
=======
            successRedirect: 'http://localhost:5000/api/jwt',
            failureRedirect: 'http://localhost:5000/api/account/google',
>>>>>>> fk-dev
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
<<<<<<< HEAD
            successRedirect: '/', // if user already exists --> get logged in
            failureRedirect: '/api/account/register', // if user is created
            failureFlash: true
        })(req, res, next)
=======
            successRedirect: 'http://localhost:5000/api/jwt',
            failureRedirect: 'http://localhost:5000/api/account/github',
            failureFlash: true
        })(req, res, next);
>>>>>>> fk-dev
    },
    fortyTwo: (req, res, next) => { // load login window
        passport.authenticate('42')(req, res, next)
    },
    fortyTwoRedirect: (req, res, next) => { // load data
        console.log('been there');
        passport.authenticate('42', {
<<<<<<< HEAD
            successRedirect: '/', // if user already exists --> get logged in
            failureRedirect: '/api/account/register', // if user is created
            failureFlash: true
        })(req, res, next)
    }
};
=======
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
>>>>>>> fk-dev

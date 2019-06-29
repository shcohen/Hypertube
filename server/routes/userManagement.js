const passport = require('passport');
const User = require('../models/user');

module.exports  = {
    register: (req, res, next) => {
        console.log('been there');
        let {email, password, firstname, lastname} = req.body;
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).send('invalid request')
        } else {
            console.log('done that');
            passport.authenticate('local-signup', {
                successRedirect: '/home',
                failureRedirect: '/api/account/register',
                failureFlash: true
            })(req, res, next);
        }
    },
    authenticate: (req, res, next) => {
        User.authenticate()
    }
};
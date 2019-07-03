const passport = require('passport');
const crypto = require('crypto');
const secret = require('../config/private/config');
const mailUtils = require('../utils/mailUtils');
const User = require('../models/user');

const validator = require("email-validator");
const passwordValidator = require('password-validator');
const schema = new passwordValidator(); // create a validation schema
schema // add properties to it
    .is().min(8)                                    // minimum length 8
    .is().max(20)                                   // maximum length 20
    .has().uppercase()                              // must have uppercase letters
    .has().lowercase()                              // must have lowercase letters
    .has().digits()                                 // must have digits
    .has().not().spaces();                          // should not have spaces

module.exports = {
    register: (req, res, next) => {
        console.log('been there');
        let {email, username, password, firstname, lastname} = req.body;
        if (!email || !username || !password || !firstname || !lastname) {
            return res.status(400).send('invalid request')
        } else {
            if (validator.validate(email) === true) {
                if (schema.validate(password, {list: false})) {
                    console.log('done that');
                    passport.authenticate('local-signup', {
                        successRedirect: '/home',
                        failureRedirect: '/api/account/register',
                        failureFlash: true
                    })(req, res, next);
                } else {
                    console.log('invalid password provided: missing ' + schema.validate(password, {list: true}));
                    return res.status(400).send('invalid password provided: missing ' + schema.validate(password, {list: true}))
                }
            } else {
                console.log('invalid email provided');
                return res.status(400).send('invalid email provided')
            }
        }
    },
    authenticate: (req, res, next) => {
        console.log('been there');
        let {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).send('invalid request')
        } else {
            console.log('done that');
            passport.authenticate('local-signin', {
                successRedirect: '/home',
                failureRedirect: '/api/account/login',
                failureFlash: true
            })(req, res, next);
        }
    },
    validateAccount: (req, res, next) => {
        console.log('1');

    }
};
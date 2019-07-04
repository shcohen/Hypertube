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
    register: (req, res, next) => { // add username check !!!!!
        console.log('been there');
        let {email, username, password, firstname, lastname} = req.body;
        if (!email || !username || !password || !firstname || !lastname) {
            return res.status(400).send('error: invalid request')
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
                return res.status(400).send('error: invalid email provided')
            }
        }
    },
    authenticate: (req, res, next) => {
        console.log('been there');
        let {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).send('error: invalid request')
        } else {
            console.log('done that');
            passport.authenticate('local-signin', {
                successRedirect: '/home',
                failureRedirect: '/api/account/login',
                failureFlash: true
            })(req, res, next);
        }
    },
    modify: (req, res) => { // add username check
        console.log('1');
        let {acc_id, email, username, password, rpassword, firstname, lastname} = req.body;
        // !acc_id || !email || !username || !password || !rpassword || !firstname || !lastname
        if (!acc_id || !email || !username || !password || !rpassword || !firstname || !lastname) {
            return res.status(400).send('error: invalid request')
        } else {
            console.log('2');
            if (password !== rpassword) {
                console.log('passwords do not match');
                return res.status(400).send('error: passwords do not match')
            } else {
                if (schema.validate(password, {list: false})) {
                    if (validator.validate(email) === true) {
                        console.log('3');
                        User.findOne({
                            acc_id: acc_id
                        }, (error, user) => {
                            if (error) {
                                console.log('error:', error);
                                return res.status(400).send('error: invalid request')
                            } else if (!user) {
                                console.log('no account found');
                                return res.status(400).send('error: no account found with this id')
                            } else {
                                console.log('3');
                                email ? user.email = email : null;
                                username ? user.username = username : null;
                                password ? user.password = password : null;
                                firstname ? user.firstname = firstname : null;
                                lastname ? user.lastname = lastname : null;
                                user.save((error) => {
                                    console.log('4');
                                    if (error) {
                                        console.log('error:', error);
                                        return res.status(400).send('error: ', error)
                                    } else {
                                        console.log('5');
                                        console.log('success: user info updated');
                                        return res.status(200).send('success: user info updated')
                                    }
                                })
                            }
                        })
                    } else {
                        console.log('invalid password provided: missing ' + schema.validate(password, {list: true}));
                        return res.status(400).send('invalid password provided: missing ' + schema.validate(password, {list: true}))
                    }
                } else {
                    console.log('invalid email provided');
                    return res.status(400).send('invalid email provided')
                }
            }
        }
    },
    validateAccount: (req, res) => {
        console.log('1');
        let {token} = req.body;
        if (token) {
            console.log('2');
            return User.findOne({
                validationToken: token
            }).then(user => {
                console.log('3');
                if (user) {
                    console.log('4');
                    if (user.validation === true) {
                        console.log('error: account already confirmed');
                        return res.status(200).send('error: account already confirmed')
                    } else {
                        console.log('5');
                        return res.status(400).send('success: account is now confirmed')
                    }
                } else {
                    return res.status(400).send('error: no account found')
                }
            })
        } else {
            return res.status(400).send('error: invalid token provided')
        }
    }
};
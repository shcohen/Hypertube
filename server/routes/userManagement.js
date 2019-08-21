const passport = require('passport');
const User = require('../models/user');
const mailsUtils = require('../utils/mailUtils');
const uuid = require('uuid');
const multer = require('multer');
const xss = require('xss');
const upload = multer({dest: 'uploads/'});
const Joi = require('@hapi/joi');
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
    validateImage: (type, tmpBuffer) => {
        let magic = [];
        let Buffer = JSON.parse(JSON.stringify(tmpBuffer));
        let extractMagic = null;
        switch (type) {
            case 'image/jpeg':
                extractMagic = Buffer.data.toString().split(',').join(' ').substr(0, 8).split(' ');
                extractMagic.pop();
                for (let i = 0; i < extractMagic.length; i++) {
                    magic[i] = parseInt(extractMagic[i]).toString(16);
                }
                return magic.join(' ') === 'ff d8';
            case 'image/png':
                extractMagic = Buffer.data.toString().split(',').join(' ').substr(0, 24).split(' ');
                for (let i = 0; i < extractMagic.length; i++) {
                    magic[i] = parseInt(extractMagic[i]).toString(16);
                }
                return magic.join(' ') === '89 50 4e 47 d a 1a a';
            default:
                return false;
        }
    },
    register: (req, res, next) => {
        console.log('been there');
        let {email, username, password, firstname, lastname} = req.body;
        let {profilePic} = req.file;
        if (!email || !username || !password || !firstname || !lastname) {
            console.log(req.body);
            console.log(req.file);
            return res.status(200).send('error: invalid request')
        } else if (email.type && typeof email.type !== 'string' || username.type && typeof username.type !== 'string' || password.type && typeof password.type !== 'string'
        || firstname.type && typeof firstname.type !== 'string' || lastname.type && typeof lastname.type !== 'string') {
            console.log(req.body);
            return res.status(200).send('error: invalid request')
        } else {
            if (validator.validate(email) === true) {
                User.find({
                    email: email
                }).then((user, error) => {
                    if (user.length) {
                        console.log(user);
                        console.log('email already taken');
                        return res.status(200).send('email already taken')
                    } else if (error) {
                        console.log(error);
                        return res.status(200).send('error: ', error)
                    } else {
                        if (schema.validate(password, {list: false})) {
                            User.findOne({
                                username: username
                            }).then((user, error) => {
                                if (user) {
                                    console.log('username already taken');
                                    return res.status(200).send('username already taken')
                                } else if (error) {
                                    console.log(error);
                                    return res.status(200).send('error: ', error)
                                } else {
                                   //if (validateImage(profilePic.mimetype, profilePic.data)) {
                                       console.log('done that');
                                       passport.authenticate('local-signup', {
                                           successRedirect: '/home',
                                           failureRedirect: '/api/account/register',
                                           failureFlash: true
                                       })(req, res, next);
                                  // }
                                }
                            })
                        } else {
                            console.log('invalid password provided: missing ' + schema.validate(password, {list: true}));
                            return res.status(200).send('invalid password provided: missing ' + schema.validate(password, {list: true}))
                        }
                    }
                })
            } else {
                console.log('invalid email provided');
                return res.status(200).send('error: invalid email provided')
            }
        }
    },
    authenticate: (req, res, next) => {
        console.log('been there');
        let {username, password} = req.body;
        if (!username || !password) {
            return res.status(200).send('error: invalid request')
        } else {
            console.log('done that');
            passport.authenticate('local-signin', {
                successRedirect: '/home',
                failureRedirect: '/api/account/login',
                failureFlash: true
            })(req, res, next);
        }
    },
    modify: (req, res) => {
        console.log('0');
        let {acc_id, email, username, password, rpassword, firstname, lastname} = req.body;
        let {profilePic} = req.file;
        if (!acc_id || !email && !username && !password && !rpassword && !firstname && !lastname && !profilePic) {
            return res.status(200).send('error: invalid request')
        } else if (acc_id.type && typeof acc_id.type !== 'string' || email.type && typeof email.type !== 'string' || username.type && typeof username.type !== 'string' || password.type && typeof password.type !== 'string'
           || rpassword.type && typeof rpassword.type !== 'string' || firstname.type && typeof firstname.type !== 'string' || lastname.type && typeof lastname.type !== 'string') {
            console.log(req.body);
            return res.status(200).send('error: invalid request')
        } else {
            console.log('1');
            let i = 1;
            switch (i) {
                case 1:
                    console.log('password 1');
                    if (password && rpassword) {
                        if (password !== rpassword) {
                            console.log('passwords do not match');
                            return res.status(200).send('error: passwords do not match');
                        } else {
                            if (!schema.validate(password, {list: false})) {
                                console.log('invalid password provided: missing ' + schema.validate(password, {list: true}));
                                return res.status(200).send('invalid password provided: missing ' + schema.validate(password, {list: true}))
                            }
                        }
                    } else if (!password && rpassword || password && !rpassword) {
                        console.log('missing password or rpassword');
                        return res.status(200).send('missing password or rpassword')
                    }
                case 2:
                    console.log('email 1');
                    if (email) {
                        User.findOne({
                            email: email
                        }).then((user, error) => {
                            if (user) {
                                console.log('email already taken');
                                return res.status(200).send('email already taken')
                            } else if (error) {
                                console.log(error);
                                return res.status(200).send('error: ', error)
                            } else {
                                if (validator.validate(email) === true) {
                                    console.log('email: ok')
                                } else {
                                    console.log('invalid email provided');
                                    return res.status(200).send('invalid email provided')
                                }
                            }
                        })
                    }
                case 3:
                    console.log('username 1');
                    if (username) {
                        User.findOne({
                            username: username
                        }).then((user, error) => {
                            if (user) {
                                console.log('username already taken');
                                return res.status(200).send('username already taken')
                            } else if (error) {
                                console.log(error);
                                return res.status(200).send('error: ', error)
                            }
                        })
                    }
                case 4:
                    console.log('picture 1');
                    if (profilePic) {
                       if (validateImage(profilePic.mimetype)) {
                           console.log('picture updated')
                       }
                    }
                default:
                    console.log('2');
                    User.findOne({
                        acc_id: acc_id
                    }).then((user, error) => {
                        if (!user) {
                            console.log('no account found');
                            return res.status(200).send('error: no account found')
                        } else if (error) {
                            console.log('error:', error);
                            return res.status(200).send('error: invalid request')
                        } else {
                            console.log('3');
                            email ? user.email = xss(email) : null;
                            username ? user.username = xss(username) : null;
                            password ? user.password = xss(password) : null;
                            firstname ? user.firstname = xss(firstname) : null;
                            lastname ? user.lastname = xss(lastname) : null;
                            user.save((error) => {
                                console.log('4');
                                if (error) {
                                    console.log('error:', error);
                                    return res.status(200).send('error: ', error)
                                } else {
                                    console.log('5');
                                    console.log('success: user info updated');
                                    return res.status(200).send('success: user info updated')
                                }
                            })
                        }
                    })
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
            }).then((user, error) => {
                console.log('3');
                if (user) {
                    console.log('4');
                    if (user.validation === true) {
                        console.log('error: account already confirmed');
                        return res.status(200).send('error: account already confirmed')
                    } else {
                        console.log('5');
                        return res.status(200).send('success: account is now confirmed')
                    }
                } else if (error) {
                    console.log('error: ', error);
                    return res.status(200).send('error: ', error)
                } else {
                    return res.status(200).send('error: no account found')
                }
            })
        } else {
            return res.status(200).send('error: invalid token provided')
        }
    },
    sendForgotPassword: (req, res) => {
        let {email} = req.body;
        console.log('1');
        User.findOne({
            email: email
        }).then((user, error) => {
            if (user) {
                console.log('2');
                const token = uuid.v4();
                user.resetToken = token;
                user.save((error) => {
                    if (error) {
                        console.log('error:', error);
                        return res.status(200).send('error: ', error)
                    } else {
                        console.log('3');
                        mailsUtils.resetMail(email, token);
                        console.log('success: reset email sent');
                        return res.status(200).send('success: reset mail sent')
                    }
                })
            } else if (error) {
                console.log('error: ', error);
                return res.status(200).send('error: ', error)
            } else {
                console.log('error: invalid email provided');
                return res.status(200).send('error: invalid email provided')
            }
        })
    },
    resetPassword: (req, res) => {
        let {password, rpassword, resetToken} = req.body;
        User.findOne({
            resetToken: resetToken
        }).then((user, error) => {
            if (user) {
                if (password && rpassword) {
                    if (password !== rpassword) {
                        console.log('passwords do not match');
                        return res.status(200).send('error: passwords do not match');
                    } else {
                        if (!schema.validate(password, {list: false})) {
                            console.log('invalid password provided: missing ' + schema.validate(password, {list: true}));
                            return res.status(200).send('invalid password provided: missing ' + schema.validate(password, {list: true}))
                        } else {
                            user.password = password;
                            user.save((error) => {
                                if (error) {
                                    console.log('error: ', error);
                                    return res.status(200).send('error: ', error)
                                } else {
                                    console.log('success: password updated');
                                    return res.status(200).send('success: password updated')
                                }
                            })
                        }
                    }
                } else if (!password && rpassword || password && !rpassword) {
                    console.log('missing password or rpassword');
                    return res.status(200).send('missing password or rpassword')
                }
            } else if (error) {
                console.log('error: ', error);
                return res.status(200).send('error: ', error)
            } else {
                console.log('error: invalid token provided');
                return res.status(200).send('error: invalid token provided')
            }
        })
    }
};
const passport = require('passport');
const User = require('../models/user');
const mailsUtils = require('../utils/mailUtils');
const userUtils = require('../utils/userUtils');
const uuid = require('uuid');
const fs = require('fs');
const xss = require('xss');
const validator = require('email-validator');
const passwordValidator = require('password-validator');
const schema = new passwordValidator(); // creates a validation schema
schema // adds properties to it
    .is().min(8)                                    // minimum length 8
    .is().max(20)                                   // maximum length 20
    .has().uppercase()                              // must have uppercase letters
    .has().lowercase()                              // must have lowercase letters
    .has().digits()                                 // must have digits
    .has().not().spaces();                          // should not have spaces

module.exports = {
    validateImage: (profilePic) => {
        if (profilePic.size > 0 && profilePic.size < 200000) {
            let img = fs.readFileSync(profilePic.path);
            let encode_image = img.toString('base64');
            if (profilePic.mimetype === 'image/jpeg' || profilePic.mimetype === 'image/jpg') {
                return { // defines a JSONobject for the image attributes to save to database
                    contentType: profilePic.mimetype,
                    data: new Buffer.from(encode_image, 'base64')
                };
            } else {
                return false
            }
        } else {
            return false
        }
    },
    register: (req, res, next) => {
        console.log('been there');
        let {email, username, password, firstname, lastname} = req.body;
        let profilePic = req.file;
        if (!email || !username || !password || !firstname || !lastname || !profilePic) {
            return res.status(400).send('error: invalid request')
        } else {
            if (validator.validate(email) === true) {
                User.find({
                    email: email
                }).then((user, error) => {
                    if (user.length) {
                        console.log('email already taken');
                        return res.status(400).send('error: email already taken')
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
                                    if (module.exports.validateImage(profilePic) !== false) {
                                        console.log('done that');
                                        passport.authenticate('local-signup', {
                                            successRedirect: '/home',
                                            failureRedirect: '/api/account/register',
                                            failureFlash: true
                                        })(req, res, next);
                                    } else {
                                        console.log('error: invalid picture provided');
                                        return res.status(400).send('error: invalid picture provided')
                                    }
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
    modify: async (req, res) => {
        let modifyData = {};
        let {acc_id, email, username, password, rpassword, firstname, lastname} = req.body;
        let profilePic = req.file ? req.file : null;
        if (!acc_id || !email && !username && !password && !rpassword && !firstname && !lastname && !profilePic) {
            return res.status(400).send('error: invalid request')
        } else {
            // password check
            if (password && password.length && rpassword && rpassword.length) {
                let passwordCheck = await userUtils.checkPassword(password, rpassword);
                if (passwordCheck.errorCode === -1)
                    modifyData.passwordCheck = passwordCheck.errorMessage;
                else {
                    modifyData.passwordCheck = passwordCheck.successMessage;
                    modifyData.password = password;
                }
            } else if (!password && rpassword || password && !rpassword) {
                console.log('missing password or rpassword');
                modifyData.passwordError = 'error: missing password or repeat-password';
            }
            // email check
            if (email && email.length) {
                let emailCheck = await userUtils.checkEmail(email);
                if (emailCheck.errorCode === -1)
                    modifyData.emailCheck = emailCheck.errorMessage;
                else {
                    modifyData.emailCheck = emailCheck.successMessage;
                    modifyData.email = email;
                }
            }
            // username check
            if (username && username.length) {
                let usernameCheck = await userUtils.checkUsername(username);
                if (usernameCheck.errorCode === -1)
                    modifyData.usernameCheck = usernameCheck.errorMessage;
                else {
                    modifyData.usernameCheck = usernameCheck.successMessage;
                    modifyData.username = username;
                }
            }
            // firstname check
            if (firstname && firstname.length) {
                firstname = firstname.trim();
                let firstnameCheck = await userUtils.checkFirstname(firstname);
                if (firstnameCheck.errorCode === -1)
                    modifyData.firstnameCheck = firstnameCheck.errorMessage;
                else {
                    modifyData.firstnameCheck = firstnameCheck.successMessage;
                    modifyData.firstname = firstname;
                }
            }
            // lastname check
            if (lastname && lastname.length) {
                lastname = lastname.trim();
                let lastnameCheck = await userUtils.checkLastname(lastname);
                if (lastnameCheck.errorCode === -1)
                    modifyData.lastnameCheck = lastnameCheck.errorMessage;
                else {
                    modifyData.lastnameCheck = lastnameCheck.successMessage;
                    modifyData.lastname = lastname;
                }
            }
            // profile picture check
            if (profilePic) {
                if (await module.exports.validateImage(profilePic) !== false) {
                    profilePic = profilePic.path;
                    console.log('success: profile picture updated')
                } else {
                    console.log('error: invalid picture provided');
                    return res.status(400).send('error: invalid picture provided')
                }
            }
            // next
            User.findOne({
                acc_id: acc_id
            }).then((user, error) => {
                if (!user) {
                    console.log('no account found');
                    return res.status(401).send('error: no account found')
                } else if (error) {
                    console.log('error:', error);
                    return res.status(400).send('error: invalid request')
                } else {
                    email ? user.email = xss(email) : null;
                    username ? user.username = xss(username) : null;
                    modifyData.password ? user.password = xss(modifyData.password) : null;
                    firstname ? user.firstname = xss(firstname) : null;
                    lastname ? user.lastname = xss(lastname) : null;
                    profilePic ? user.profilePic = profilePic : null;
                    user.save((error) => {
                        if (error) {
                            console.log('error:', error);
                            return res.status(500).send('error: ', error)
                        } else {
                            console.log('success: user info updated');
                            return res.status(200).send('success: user info updated')
                        }
                    })
                }
            })
        }
    },
    validateAccount: (req, res) => {
        let {token} = req.body;
        if (token) {
            return User.findOne({
                validationToken: token
            }).then((user, error) => {
                if (user) {
                    if (user.validation === true) {
                        console.log('error: account already confirmed');
                        return res.status(401).send('error: account already confirmed')
                    } else {
                        return res.status(200).send('success: account is now confirmed')
                    }
                } else if (error) {
                    console.log('error: ', error);
                    return res.status(500).send('error: ', error)
                } else {
                    return res.status(401).send('error: no account found')
                }
            })
        } else {
            return res.status(400).send('error: invalid token provided')
        }
    },
    sendForgotPassword: (req, res) => {
        let {email} = req.body;
        User.findOne({
            email: email
        }).then((user, error) => {
            if (user) {
                const token = uuid.v4();
                user.resetToken = token;
                user.save((error) => {
                    if (error) {
                        console.log('error:', error);
                        return res.status(500).send('error: ', error)
                    } else {
                        mailsUtils.resetMail(email, token);
                        console.log('success: reset email sent');
                        return res.status(200).send('success: reset mail sent')
                    }
                })
            } else if (error) {
                console.log('error: ', error);
                return res.status(500).send('error: ', error)
            } else {
                console.log('error: invalid email provided');
                return res.status(400).send('error: invalid email provided')
            }
        })
    },
    resetPassword:
        (req, res) => {
            let {password, rpassword, resetToken} = req.body;
            User.findOne({
                resetToken: resetToken
            }).then((user, error) => {
                if (user) {
                    if (password && rpassword) {
                        if (password !== rpassword) {
                            console.log('passwords do not match');
                            return res.status(400).send('error: passwords do not match');
                        } else {
                            if (!schema.validate(password, {list: false})) {
                                console.log('invalid password provided: missing ' + schema.validate(password, {list: true}));
                                return res.status(400).send('invalid password provided: missing ' + schema.validate(password, {list: true}))
                            } else {
                                user.password = password;
                                user.save((error) => {
                                    if (error) {
                                        console.log('error: ', error);
                                        return res.status(500).send('error: ', error)
                                    } else {
                                        console.log('success: password updated');
                                        return res.status(200).send('success: password updated')
                                    }
                                })
                            }
                        }
                    } else if (!password && rpassword || password && !rpassword) {
                        console.log('missing password or rpassword');
                        return res.status(400).send('missing password or rpassword')
                    }
                } else if (error) {
                    console.log('error: ', error);
                    return res.status(500).send('error: ', error)
                } else {
                    console.log('error: invalid token provided');
                    return res.status(400).send('error: invalid token provided')
                }
            })
        }
};
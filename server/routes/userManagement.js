const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mailsUtils = require('../utils/mailUtils');
const userUtils = require('../utils/userUtils');
const uuid = require('uuid');
const fs = require('fs');
const xss = require('xss');
const validator = require('email-validator');
const passwordValidator = require('password-validator');
const {getUserInfos} = require('../utils/jwt_check');
const axios = require('axios');
const {RAPIDAPI_KEY} = require('../config/apiKey');
const {translateSentence} = require('../utils/languageUtils');
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
        if (profilePic.size > 0 && profilePic.size < 2000000) {
            let img = fs.readFileSync(profilePic.path);
            let encode_image = img.toString('base64');
            if (profilePic.mimetype === 'image/jpeg' || profilePic.mimetype === 'image/jpg' || profilePic.mimetype === 'image/png') {
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
    register: async (req, res, next) => {
        console.log('been there');
        let checkData = {};
        let profilePic = req.file;
        let {email, username, password, firstname, confirm, lastname} = req.body;
        if (!email || !username || !password || !confirm || !firstname || !lastname) {
            checkData.dataError = await translateSentence('Missing data', req);
            return res.status(400).send(checkData);
        } else {
            if (!password && confirm) {
                checkData.passwordError = await translateSentence('Password missing', req);
            }
            if (password !== confirm || password && !confirm) {
                checkData.confirmError = await translateSentence('Passwords do not match', req);
            }
            if (validator.validate(email) === false) {
                console.log('invalid email provided');
                checkData.emailError = await translateSentence('Invalid email provided', req);
            }
            if (!username.match(/^[a-zA-Z0-9]{1,32}$/)) {
                checkData.usernameError = await translateSentence('Your username must be alphanumeric and less than 32 characters', req);
            }
            if (firstname.length > 32 || !firstname.match(/^([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/)) {
                checkData.firstnameError = await translateSentence('Your firstname must only contain letters and be less than 32 characters', req);
            }
            if (lastname.length > 32 || !lastname.match(/^([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/)) {
                checkData.lastnameError = await translateSentence('Your lastname must only contain letters and be less than 32 characters', req);
            }
            User.find({
                email: email
            }).then(async (user, error) => {
                if (user.length) {
                    console.log('email already taken');
                    checkData.emailError = await translateSentence('Email already taken', req);
                } else if (error) {
                    console.log(error);
                    return res.status(500).send('error: ', error)
                }
                if (!schema.validate(password, {list: false})) {
                    checkData.passwordError = await translateSentence('Your password lacks: ' + schema.validate(password, {list: true}), req);
                }
                User.findOne({
                    username: username
                }).then(async (user, error) => {
                    if (user) {
                        console.log('username already taken');
                        checkData.usernameError = await translateSentence('Username already taken', req);
                    } else if (error) {
                        console.log(error);
                        return res.status(500).send('error: ', error)
                    }
                    if (!profilePic) {
                        checkData.profilePicError = await translateSentence('Missing profile picture', req);
                        return res.status(400).send(checkData);
                    }
                    if (await module.exports.validateImage(profilePic) === false) {
                        console.log(profilePic);
                        console.log('error: invalid picture provided');
                        checkData.profilePicError = 'PNG or JPEG, less than 2MB';
                    }
                    if (checkData && !Object.values(checkData).length) {
                        passport.authenticate('local-signup', {
                            successRedirect: '/api/account/registerSuccess',
                            failureRedirect: '/api/account/registerFailure',
                            session: false,
                            failureFlash: true
                        })(req, res, next)
                    } else {
                        return res.status(400).send(checkData)
                    }
                })
            })
        }
    },
    registerFailure: (req, res) => {
        return res.status(409);
    },
    registerSuccess: (req, res) => {
        return res.status(201);
    },
    authenticate:
        (req, res, next) => {
            console.log('been there');
            let {username, password} = req.body;
            if (!username || !password) {
                console.log('error: invalid request');
                return res.status(400).send('error: invalid request')
            } else {
                console.log('done that');
                passport.authenticate('local-signin', {
                    successRedirect: '/api/jwt',
                    failureRedirect: '/api/account/loginFailure',
                    failureFlash: true
                })(req, res, next);
            }
        },
    loginFailure: async (req, res) => {
        let loginError = req.flash('errorMessage');
        return res.status(400).send(await translateSentence(loginError, req));
    },
    modify: async (req, res) => {
        const connectedUser = getUserInfos(req.headers.authorization);
        if (!connectedUser) {
            res.status(401).send('Unauthorized')
        } else {
            let modifyData = {};
            let acc_id = connectedUser.acc_id;
            let profilePic = req.file ? req.file : null;
            let {email, username, password, confirm, firstname, lastname} = req.body;
            if (!acc_id || !email && !username && !password && !confirm && !firstname && !lastname && !profilePic) {
                modifyData.errorMessage = await translateSentence('Invalid request', req);
                return res.status(400).send(modifyData)
            } else {
                // password check
                if (password && password.length && confirm && confirm.length) {
                    let passwordCheck = await userUtils.checkPassword(password, confirm);
                    if (passwordCheck.errorCode === -1) {
                        modifyData.passwordError = await translateSentence(passwordCheck.errorMessage, req);
                    } else {
                        modifyData.passwordCheck = await translateSentence(passwordCheck.successMessage, req);
                        modifyData.password = password;
                    }
                } else if (!password && confirm || password && !confirm) {
                    console.log('missing password or confirm');
                    modifyData.passwordError = await translateSentence('Missing passwords', req);
                }
                // email check
                if (email && email.length) {
                    let emailCheck = await userUtils.checkEmail(email, acc_id);
                    if (emailCheck.errorCode === -1) {
                        modifyData.emailError = await translateSentence(emailCheck.errorMessage, req);
                    } else {
                        modifyData.emailCheck = await translateSentence(emailCheck.successMessage, req);
                        modifyData.email = email;
                    }
                }
                // username check
                if (username && username.length) {
                    let usernameCheck = await userUtils.checkUsername(username, acc_id);
                    if (usernameCheck.errorCode === -1) {
                        modifyData.usernameError = await translateSentence(usernameCheck.errorMessage, req);
                    } else {
                        modifyData.usernameCheck = await translateSentence(usernameCheck.successMessage, req);
                        modifyData.username = username;
                    }
                }
                // firstname check
                if (firstname && firstname.length) {
                    firstname = firstname.trim();
                    let firstnameCheck = await userUtils.checkFirstname(firstname);
                    if (firstnameCheck.errorCode === -1) {
                        modifyData.firstnameError = await translateSentence(firstnameCheck.errorMessage, req);
                    } else {
                        modifyData.firstnameCheck = await translateSentence(firstnameCheck.successMessage, req);
                        modifyData.firstname = firstname;
                    }
                }
                // lastname check
                if (lastname && lastname.length) {
                    lastname = lastname.trim();
                    let lastnameCheck = await userUtils.checkLastname(lastname);
                    if (lastnameCheck.errorCode === -1) {
                        modifyData.lastnameError = await translateSentence(lastnameCheck.errorMessage, req);
                    } else {
                        modifyData.lastnameCheck = await translateSentence(lastnameCheck.successMessage, req);
                        modifyData.lastname = lastname;
                    }
                }
                // profile picture check
                if (profilePic) {
                    if (await module.exports.validateImage(profilePic) !== false) {
                        modifyData.pictureCheck = await translateSentence('Profile picture updated', req);
                        profilePic = profilePic.path;
                    } else {
                        console.log('error: invalid picture provided');
                        modifyData.profilePicError = await translateSentence('Invalid picture provided', req);
                        profilePic = null;
                    }
                }
                // next
                User.findOne({
                    acc_id: acc_id
                }).then(async (user, error) => {
                    if (!user) {
                        console.log('no account found');
                        modifyData.errorMessage = await translateSentence('Account not found', req);
                        return res.status(401).send(modifyData)
                    } else if (error) {
                        console.log('error:', error);
                        return res.status(400).send('error: ', error)
                    } else {
                        modifyData.email ? user.email = xss(modifyData.email) : null;
                        modifyData.username ? user.username = xss(modifyData.username) : null;
                        modifyData.password ? user.password = xss(modifyData.password) : null;
                        modifyData.firstname ? user.firstname = xss(firstname) : null;
                        modifyData.lastname ? user.lastname = xss(lastname) : null;
                        profilePic ? user.profilePic = '/uploads/' + profilePic : null;
                        user.save(async error => {
                            if (error) {
                                console.log('error:', error);
                                return res.status(500).send('error: ', error)
                            } else {
                                console.log('success: user info updated');
                                modifyData.successMessage = await translateSentence('User info updated', req);
                                return res.status(200).send(modifyData);
                            }
                        })
                    }
                })
            }
        }
    },
    validateAccount: async (req, res) => {
        let checkToken = {};
        let {token} = req.body;
        if (token) {
            return User.findOne({
                validationToken: token
            }).then(async (user, error) => {
                if (user) {
                    if (user.validation === true) {
                        console.log('error: account already confirmed');
                        checkToken.errorMessage = await translateSentence('Account not found', req);
                        return res.status(401).send(checkToken)
                    } else {
                        User.findOneAndUpdate({
                            validationToken: token
                        }, {validation: true}).then(async (user, error) => {
                            if (user) {
                                checkToken.successMessage = await translateSentence('Account is not confirmed, you cannot log in', req);
                                return res.status(200).send(checkToken)
                            } else if (error) {
                                console.log('error: ', error);
                                return res.status(500).send('error: ', error)
                            }
                        });
                    }
                } else if (error) {
                    console.log('error: ', error);
                    return res.status(500).send('error: ', error)
                } else {
                    checkToken.errorMessage = await translateSentence('Account not found', req);
                    return res.status(401).send(checkToken)
                }
            })
        } else {
            checkToken.errorMessage = await translateSentence('Invalid token provided', req);
            return res.status(400).send(checkToken)
        }
    },
    sendForgotPassword: (req, res) => {
        let checkData = {};
        let {email} = req.body;
        User.findOne({
            email: email
        }).then(async (user, error) => {
            if (user) {
                const token = uuid.v4();
                user.resetToken = token;
                user.save(async error => {
                    if (error) {
                        console.log('error:', error);
                        return res.status(500).send('error: ', error)
                    } else {
                        mailsUtils.resetMail(email, token);
                        console.log('success: reset email sent');
                        checkData.successMessage = await translateSentence('Password reset mail send', req);
                        return res.status(200).send(checkData)
                    }
                })
            } else if (error) {
                console.log('error: ', error);
                return res.status(500).send('error: ', error)
            } else {
                console.log('error: invalid email provided');
                checkData.errorMessage = await translateSentence('Invalid email provided', req);
                return res.status(400).send(checkData)
            }
        })
    },
    resetPassword: (req, res) => {
        let checkPassword = {};
        let {password, confirm, resetToken} = req.body;
        User.findOne({
            resetToken: resetToken
        }).then(async (user, error) => {
            if (user) {
                if (password && confirm) {
                    if (password !== confirm) {
                        console.log('passwords do not match');
                        checkPassword.errorMessage = await translateSentence('Passwords do not match', req);
                        return res.status(400).send(checkPassword);
                    } else {
                        if (!schema.validate(password, {list: false})) {
                            console.log('invalid password provided: missing ' + schema.validate(password, {list: true}));
                            checkPassword.errorMessage = await translateSentence('Invalid password provided: missing ' + schema.validate(password, {list: true}), req);
                            return res.status(400).send(checkPassword)
                        } else {
                            user.password = password;
                            user.resetToken = null;
                            user.save(async error => {
                                if (error) {
                                    console.log('error: ', error);
                                    return res.status(500).send('error: ', error)
                                } else {
                                    console.log('success: password updated');
                                    checkPassword.successMessage = await translateSentence('Password updated successfully', req);
                                    return res.status(200).send(checkPassword)
                                }
                            })
                        }
                    }
                } else if (!password && confirm || password && !confirm) {
                    console.log('missing password or confirm');
                    checkPassword.errorMessage = await translateSentence('Missing password or password confirmation', req);
                    return res.status(400).send(checkPassword)
                }
            } else if (error) {
                console.log('error: ', error);
                return res.status(500).send('error: ', error)
            } else {
                console.log('error: invalid token provided');
                checkPassword.errorMessage = await translateSentence('Invalid token provided', req);
                return res.status(400).send(checkPassword)
            }
        })
    },
    changeLang: async (req, res) => {
        let checkData = {};
        const connectedUser = getUserInfos(req.headers.authorization);
        if (!connectedUser) {
            res.status(401).send('Unauthorized')
        } else {
            let acc_id = connectedUser.acc_id;
            let {lang} = req.body;
            if (!acc_id || !lang) {
                console.log('invalid request');
                checkData.errorMessage = await translateSentence('Invalid request', req);
                return res.status(400).send(checkData)
            } else {
                User.findOneAndUpdate({
                    acc_id: acc_id
                }, {lang: lang}).then(async (user, error) => {
                    if (error) {
                        console.log('error: ', error);
                        return res.status(500).send('error: ', error)
                    } else if (user) {
                        console.log('success: language updated');
                        checkData.successMessage = await translateSentence('Language updated', req);
                        const payload = {
                            acc_id: user.acc_id,
                            email: user.email,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            lang: lang,
                            profilePic: user.profilePic,
                            username: user.username
                        };
                        jwt.sign(payload, 'hypertube', {expiresIn: "1d"}, (err, token) => {
                            res.cookie('jwtToken', token, {
                                maxAge: 1000 * 60 * 60 * 24
                            });
                            return res.status(200).send(checkData)
                        });
                    }
                })
            }
        }
    },
    getProfile: async (req, res) => {
        let checkProfile = {};
        const connectedUser = getUserInfos(req.headers.authorization);
        if (!connectedUser) {
            res.status(401).send('Unauthorized');
        } else {
            const {acc_id} = connectedUser;
            const {user_id} = req.query;
            if (!user_id) {
                checkProfile.errorMessage = await translateSentence('Invalid request', req);
                return res.status(400).send(checkProfile);
            } else {
                User.findOne({
                    acc_id: acc_id
                }).then(async (user, error) => {
                    if (error) {
                        console.log(error);
                        return res.status(401).send('error: ', error)
                    } else if (user) {
                        User.findOne({
                            acc_id: xss(user_id)
                        }).then(async (profile, error) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send('error: ', error);
                            } else if (profile) {
                                return res.status(200).send({
                                    acc_id: profile.acc_id,
                                    username: profile.username,
                                    firstname: profile.firstname,
                                    lastname: profile.lastname,
                                    profilePic: profile.profilePic,
                                });
                            } else {
                                checkProfile.errorMessage = await translateSentence('No profile found', req);
                                return res.status(500).status(checkProfile)
                            }
                        })
                    } else {
                        checkProfile.errorMessage = await translateSentence('Account not found', req);
                        return res.status(401).send(checkProfile)
                    }
                });
            }
        }
    },
    watchedMovieInfo: async (req, res) => {
        const {IMDBid} = req.query;
        if (!IMDBid) {
            return res.status(400).send('error');
        }
        axios.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${IMDBid}&r=json`, {
            headers: {
                "X-RapidAPI-Host": "movie-database-imdb-alternative.p.rapidapi.com",
                "X-RapidAPI-Key": RAPIDAPI_KEY
            }
        })
          .then(async resp => {
            res.status(200).send(resp.data);
        })
          .catch(err => {
              console.log(err);
              return res.status(400).send('error');
          });
    },
};
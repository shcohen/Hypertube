const passport = require('passport');
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
            checkData.dataError = 'Missing data';
            return res.status(400).send(checkData);
        } else {
            if (!password && confirm) {
                checkData.passwordError = 'Password is missing';
            }
            if (password !== confirm || password && !confirm) {
                checkData.confirmError = 'Password dosen\'t match';
            }
            if (validator.validate(email) === false) {
                console.log('invalid email provided');
                checkData.emailError = 'Invalid email provided';
            }
            if (!username.match(/^[a-zA-Z0-9]{1,32}$/)) {
                checkData.usernameError = 'Your username must be alphanumeric and less than 32 characters';
            }
            if (firstname.length > 32 || !firstname.match(/^([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/)) {
                checkData.firstnameError = 'Your firstname must only contain letters and be less than 32 characters';
            }
            if (lastname.length > 32 || !lastname.match(/^([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/)) {
                checkData.lastnameError = 'Your lastname must only contain letters and be less than 32 characters';
            }
            User.find({
                email: email
            }).then((user, error) => {
                if (user.length) {
                    console.log('email already taken');
                    checkData.emailError = 'Email already taken';
                } else if (error) {
                    console.log(error);
                    return res.status(500).send('error: ', error)
                }
                if (!schema.validate(password, {list: false})) {
                    checkData.passwordError = 'Your password is missing: ' + schema.validate(password, {list: true});
                }
                User.findOne({
                    username: username
                }).then((user, error) => {
                    if (user) {
                        console.log('username already taken');
                        checkData.usernameError = 'Username already taken';
                    } else if (error) {
                        console.log(error);
                        return res.status(500).send('error: ', error)
                    }
                    if (!profilePic) {
                        checkData.profilePicError = 'Missing profile picture';
                        return res.status(400).send(checkData);
                    }
                    if (module.exports.validateImage(profilePic) === false) {
                        console.log('error: invalid picture provided');
                        checkData.profilePicError = 'Only PNG or JPEG format allowed';
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
        return res.status(200);
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
    loginFailure: (req, res) => {
        let loginError = req.flash('errorMessage');
        return res.status(400).send(loginError);
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
                modifyData.errorMessage = 'Invalid request';
                return res.status(400).send(modifyData)
            } else {
                // password check
                if (password && password.length && confirm && confirm.length) {
                    let passwordCheck = await userUtils.checkPassword(password, confirm);
                    if (passwordCheck.errorCode === -1) {
                        modifyData.passwordError = passwordCheck.errorMessage;
                    } else {
                        modifyData.passwordCheck = passwordCheck.successMessage;
                        modifyData.password = password;
                    }
                } else if (!password && confirm || password && !confirm) {
                    console.log('missing password or confirm');
                    modifyData.passwordError = 'error: missing password or password-confirmation';
                }
                // email check
                if (email && email.length) {
                    let emailCheck = await userUtils.checkEmail(email, acc_id);
                    if (emailCheck.errorCode === -1) {
                        modifyData.emailError = emailCheck.errorMessage;
                    } else {
                        modifyData.emailCheck = emailCheck.successMessage;
                        modifyData.email = email;
                    }
                }
                // username check
                if (username && username.length) {
                    let usernameCheck = await userUtils.checkUsername(username, acc_id);
                    if (usernameCheck.errorCode === -1) {
                        modifyData.usernameError = usernameCheck.errorMessage;
                    } else {
                        modifyData.usernameCheck = usernameCheck.successMessage;
                        modifyData.username = username;
                    }
                }
                // firstname check
                if (firstname && firstname.length) {
                    firstname = firstname.trim();
                    let firstnameCheck = await userUtils.checkFirstname(firstname);
                    if (firstnameCheck.errorCode === -1) {
                        modifyData.firstnameError = firstnameCheck.errorMessage;
                    } else {
                        modifyData.firstnameCheck = firstnameCheck.successMessage;
                        modifyData.firstname = firstname;
                    }
                }
                // lastname check
                if (lastname && lastname.length) {
                    lastname = lastname.trim();
                    let lastnameCheck = await userUtils.checkLastname(lastname);
                    if (lastnameCheck.errorCode === -1) {
                        modifyData.lastnameError = lastnameCheck.errorMessage;
                    } else {
                        modifyData.lastnameCheck = lastnameCheck.successMessage;
                        modifyData.lastname = lastname;
                    }
                }
                // profile picture check
                if (profilePic) {
                    if (await module.exports.validateImage(profilePic) !== false) {
                        modifyData.pictureCheck = 'Profile picture updated';
                        profilePic = profilePic.path;
                    } else {
                        console.log('error: invalid picture provided');
                        modifyData.profilePicError = 'Invalid picture provided';
                        profilePic = null;
                    }
                }
                // next
                User.findOne({
                    acc_id: acc_id
                }).then((user, error) => {
                    if (!user) {
                        console.log('no account found');
                        modifyData.errorMessage = 'Account not found';
                        return res.status(401).send(modifyData)
                    } else if (error) {
                        console.log('error:', error);
                        return res.status(400).send('error: ', error)
                    } else {
                        modifyData.email ? user.email = xss(modifyData.email) : null;
                        modifyData.username ? user.username = xss(modifyData.username) : null;
                        modifyData.password ? user.password = xss(modifyData.password) : null;
                        modifyData.firstname ? user.firstname = xss(modifyData.firstname) : null;
                        modifyData.lastname ? user.lastname = xss(modifyData.lastname) : null;
                        profilePic ? user.profilePic = profilePic : null;
                        user.save((error) => {
                            if (error) {
                                console.log('error:', error);
                                return res.status(500).send('error: ', error)
                            } else {
                                console.log('success: user info updated');
                                modifyData.successMessage = 'User info updated';
                                return res.status(200).send(modifyData);
                            }
                        })
                    }
                })
            }
        }
    },
    validateAccount: (req, res) => {
        let checkToken = {};
        let token = req.params.id;
        if (token) {
            return User.findOne({
                validationToken: token
            }).then((user, error) => {
                if (user) {
                    if (user.validation === true) {
                        console.log('error: account already confirmed');
                        checkToken.errorMessage = 'Account not found';
                        return res.status(401).send(checkToken)
                    } else {
                        User.findOneAndUpdate({
                            validationToken: token
                        }, {validation: true}).then((user, error) => {
                            if (user) {
                                checkToken.successMessage = 'Account is not confirmed, you can log in';
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
                    checkToken.errorMessage = 'Account not found';
                    return res.status(401).send(checkToken)
                }
            })
        } else {
            checkToken.errorMessage = 'Invalid token provided';
            return res.status(400).send(checkToken)
        }
    },
    sendForgotPassword: (req, res) => {
        let checkData = {};
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
                        checkData.successMessage = 'Password reset mail send';
                        return res.status(200).send(checkData)
                    }
                })
            } else if (error) {
                console.log('error: ', error);
                return res.status(500).send('error: ', error)
            } else {
                console.log('error: invalid email provided');
                checkData.errorMessage = 'Invalid email provided';
                return res.status(400).send(checkData)
            }
        })
    },
    resetPassword: (req, res) => {
        let checkPassword = {};
        let resetToken = req.params.id;
        let {password, confirm} = req.body;
        User.findOne({
            resetToken: resetToken
        }).then((user, error) => {
            if (user) {
                if (password && confirm) {
                    if (password !== confirm) {
                        console.log('passwords do not match');
                        checkPassword.errorMessage = 'Passwords do not match';
                        return res.status(400).send(checkPassword);
                    } else {
                        if (!schema.validate(password, {list: false})) {
                            console.log('invalid password provided: missing ' + schema.validate(password, {list: true}));
                            checkPassword.errorMessage = 'Invalid password provided: missing ' + schema.validate(password, {list: true});
                            return res.status(400).send(checkPassword)
                        } else {
                            user.password = password;
                            user.save((error) => {
                                if (error) {
                                    console.log('error: ', error);
                                    return res.status(500).send('error: ', error)
                                } else {
                                    console.log('success: password updated');
                                    checkPassword.successMessage = 'Password updated successfully';
                                    return res.status(200).send(checkPassword)
                                }
                            })
                        }
                    }
                } else if (!password && confirm || password && !confirm) {
                    console.log('missing password or confirm');
                    checkPassword.errorMessage = 'Missing password or password confirmation';
                    return res.status(400).send(checkPassword)
                }
            } else if (error) {
                console.log('error: ', error);
                return res.status(500).send('error: ', error)
            } else {
                console.log('error: invalid token provided');
                checkPassword.errorMessage = 'Invalid token provided';
                return res.status(400).send(checkPassword)
            }
        })
    },
    changeLang: (req, res) => {
        let checkData = {};
        const connectedUser = getUserInfos(req.headers.authorization);
        if (!connectedUser) {
            res.status(401).send('Unauthorized')
        } else {
            let acc_id = connectedUser.acc_id;
            let {lang} = req.body;
            if (!acc_id || !lang) {
                console.log('invalid request');
                checkData.errorMessage = 'Invalid request';
                return res.status(400).send(checkData)
            } else {
                User.findOneAndUpdate({
                    acc_id: acc_id
                }, {lang: lang}).then((user, error) => {
                    if (error) {
                        console.log('error: ', error);
                        return res.status(500).send('error: ', error)
                    } else if (user) {
                        console.log('success: language updated');
                        checkData.successMessage = 'Language updated';
                        return res.status(200).send(checkData)
                    }
                })
            }
        }
    },
    getProfile: (req, res) => {
        let checkProfile = {};
        const connectedUser = getUserInfos(req.headers.authorization);
        if (!connectedUser) {
            res.status(401).send('Unauthorized');
        } else {
            const {acc_id} = connectedUser;
            const {user_id} = req.query;
            if (!user_id) {
                checkProfile.errorMessage = 'Invalid request';
                return res.status(400).send(checkProfile);
            } else {
                User.findOne({
                    acc_id: acc_id
                }).then((user, error) => {
                    if (error) {
                        console.log(error);
                        return res.status(401).send('error: ', error)
                    } else if (user) {
                        User.findOne({
                            acc_id: xss(user_id)
                        }).then((profile, error) => {
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
                                checkProfile.errorMessage = 'No profile found';
                                return res.status(500).status(checkProfile)
                            }
                        })
                    } else {
                        checkProfile.errorMessage = 'Account not found';
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
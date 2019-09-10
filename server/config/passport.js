const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const GithubStrategy = require('passport-github2');
const FortyTwoStrategy = require('passport-42');
let config = require('../oAuth/config.js');
const xss = require('xss');
const mailUtils = require('../utils/mailUtils');
const User = require('../models/user'); // load up the user model

module.exports = (passport) => {
    /* local sign-up form */
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // access the request object in the callback
        }, (req, email, password, done) => { // retrieve data
            User.findOne({
                email: email
            }).then(user => {
                if (user !== null) {
                    console.log('email already taken');
                    return done(null, false, req.flash('errorMessage', 'Email already taken'))
                } else { // send data to schema
                    let validationToken = Math.random().toString(36).substr(2, 9);
                    User.create({
                        acc_id: Math.random().toString(36).substr(2, 9),
                        email: xss(email),
                        username: xss(req.body.username) + Math.random().toString().substr(5, 3),
                        password: xss(password),
                        firstname: xss(req.body.firstname),
                        lastname: xss(req.body.lastname),
                        validation: false,
                        validationToken: validationToken,
                        resetToken: null,
                        lang: 'en',
                        googleId: null,
                        githubId: null,
                        fortyTwoId: null,
                        accessToken: null,
<<<<<<< HEAD
                        profilePic: req.file.path
=======
                        profilePic: req.file.filename
>>>>>>> fk-dev
                    }).then((isCreated) => {
                        if (!isCreated) {
                            console.log('error while creating user');
                            return done(null, false, req.flash('errorMessage', 'User not created'))
                        } else {
                            mailUtils.sendValidationMail(email, validationToken);
                            console.log('user created');
                            return done(null, user, req.flash('successMessage', 'User created'))
                        }
                    })
                }
            })
        })
    );
    /* local sign-in form */
    passport.use('local-signin', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true, // access the request object in the callback
        }, (req, username, password, done) => { // retrieve data
            User.findOne({
                username: username
            }).then((user, error) => { // check if user exists + user info in database
                if (error) {
                    console.log(error);
<<<<<<< HEAD
                    return done(null, error)
=======
                    return done(error, false)
>>>>>>> fk-dev
                } else if (!user) {
                    console.log('error: not registered');
                    return done(null, false, req.flash('errorMessage', 'No account found'))
                } else { // checking password
                    if (user.validation) {
                        const Method = new User;
                        Method.authenticate(password, user.password)
                            .then(isLogged => {
                                if (isLogged) {
                                    console.log('success: user logged in');
                                    return done(null, user, req.flash('successMessage', 'User logged in'))
                                } else {
                                    console.log('error: wrong password');
                                    return done(null, false, req.flash('errorMessage', 'Wrong password'))
                                }
                            })
                    } else {
                        console.log('error: account not confirmed');
                        return done(null, false, req.flash('errorMessage', 'Account not confirmed'))
                    }
                }
            })
        })
    );
    /* google form */
    passport.use('google', new GoogleStrategy({ // activer le redirect depuis juste /home en api/home
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
<<<<<<< HEAD
            callbackURL: '/home',
=======
            callbackURL: '/api/account/google/redirect',
>>>>>>> fk-dev
            passReqToCallback: true
        }, (req, accessToken, refreshToken, profile, done) => {
            console.log("done that");
            if (!profile) {
                console.log('error: missing profile data');
                return done(null, false, req.flash('errorMessage', 'Missing profile data'))
            } else {
                User.findOne({
                    googleId: profile.id,
                }).then((user, error) => {
                    if (user) {
                        console.log('success: user logged in');
                        return done(null, user, req.flash('successMessage', 'User logged in'))
                    } else if (error) {
                        console.log(error);
<<<<<<< HEAD
                        return done(null, error);
=======
                        return done(error, false);
>>>>>>> fk-dev
                    } else {
                        User.findOne({
                            email: profile._json.email
                        }).then((user, error) => {
                            if (user) {
<<<<<<< HEAD
                                console.log('email already taken');
                                return done(null, false, req.flash('errorMessage', 'Email already taken'))
                            } else if (error) {
                                console.log(error);
                                return done(null, error);
=======
                                User.findOneAndUpdate({
                                    email: profile._json.email
                                }, {googleId: profile.id}).then((updated, error) => {
                                    if (error) {
                                        console.log(error);
                                        return done(error, false);
                                    } else if (updated) {
                                        console.log('success: user info updated');
                                        return done(null, updated, req.flash('successMessage', 'User info updated'))
                                    } else {
                                        console.log('error: user not found');
                                        return done(null, false, req.flash('errorMessage', 'User not found'))
                                    }
                                })
                            } else if (error) {
                                console.log(error);
                                return done(error, false);
>>>>>>> fk-dev
                            } else {
                                let validationToken = Math.random().toString(36).substr(2, 9);
                                User.create({
                                    acc_id: Math.random().toString(36).substr(2, 9),
                                    email: xss(profile._json.email),
                                    username: xss(profile.displayName.replace(/\s/g, "")) + Math.random().toString().substr(5, 3),
                                    password: 'P' + Math.random().toString(36).substr(2, 11),
                                    firstname: xss(profile._json.given_name),
                                    lastname: xss(profile._json.family_name),
                                    validation: profile._json.email_verified,
                                    validationToken: validationToken,
                                    resetToken: null,
                                    lang: profile._json.locale,
                                    googleId: profile.id,
                                    githubId: null,
                                    fortyTwoId: null,
                                    accessToken: accessToken,
                                    profilePic: profile._json.picture
                                }).then((isCreated) => {
                                    if (!isCreated) {
                                        console.log('error while creating user');
                                        return done(null, user, req.flash('errorMessage', 'User not created'))
                                    } else {
                                        console.log('success: user created');
                                        return done(null, user, req.flash('successMessage', 'User created'))
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    );
    /* github form */
    passport.use('github', new GithubStrategy({
            clientID: config.github.clientID,
            clientSecret: config.github.clientSecret,
            callbackURL: '/api/account/github/redirect',
            passReqToCallback: true
        }, (req, accessToken, refreshToken, profile, done) => {
            console.log('done that');
            if (!profile) {
                console.log('error: missing profile data');
                return done(null, false, req.flash('errorMessage', 'Missing profile data'))
            } else {
                User.findOne({
                    githubId: profile.id,
                }).then((user, error) => {
                    if (user) {
                        console.log('success: user logged in');
                        return done(null, user, req.flash('successMessage', 'User logged in'))
                    } else if (error) {
<<<<<<< HEAD
                        console.log(error);
                        return done(null, error);
=======
                        // console.log(error);
                        return done(error, false);
>>>>>>> fk-dev
                    } else {
                        User.findOne({
                            email: profile._json.email
                        }).then((user, error) => {
                            if (user) {
<<<<<<< HEAD
                                console.log('email already taken');
                                return done(null, false, req.flash('errorMessage', 'Email already taken'))
                            } else if (error) {
                                console.log(error);
                                return done(null, error);
=======
                                User.findOneAndUpdate({
                                    email: profile._json.email
                                }, {githubId: profile._json.id}).then((updated, error) => {
                                    if (error) {
                                        // console.log(error);
                                        return done(error, false);
                                    } else if (updated) {
                                        console.log('success: user info updated');
                                        return done(null, updated, req.flash('successMessage', 'User info updated'))
                                    } else {
                                        console.log('error: user not found');
                                        return done(null, false, req.flash('errorMessage', 'User not found'))
                                    }
                                })
                            } else if (error) {
                                // console.log(error);
                                return done(error, false);
>>>>>>> fk-dev
                            } else {
                                let validationToken = Math.random().toString(36).substr(2, 9);
                                User.create({
                                    acc_id: Math.random().toString(36).substr(2, 9),
                                    email: xss(profile._json.email),
                                    username: xss(profile._json.login) + Math.random().toString().substr(5, 3),
                                    password: 'P' + Math.random().toString(36).substr(2, 11),
                                    firstname: xss(profile._json.name.split(" ")[0]),
                                    lastname: xss(profile._json.name.split(" ")[1]),
                                    validation: true,
                                    validationToken: validationToken,
                                    resetToken: null,
                                    lang: 'en',
                                    googleId: null,
                                    githubId: profile._json.id,
                                    fortyTwoId: null,
                                    accessToken: accessToken,
                                    profilePic: profile._json.avatar_url
                                }).then((isCreated) => {
                                    if (!isCreated) {
                                        console.log('error while creating user');
                                        return done(null, user, req.flash('errorMessage', 'User not created'))
                                    } else {
                                        console.log('success: user created');
                                        return done(null, user, req.flash('successMessage', 'User created'))
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    );
    /* 42 form */
    passport.use('42', new FortyTwoStrategy({
            clientID: config.fortyTwo.clientID,
            clientSecret: config.fortyTwo.clientSecret,
            callbackURL: '/api/account/42/redirect',
            passReqToCallback: true
        }, (req, accessToken, refreshToken, profile, done) => {
            console.log('done that');
            if (!profile) {
                console.log('error: missing profile data');
                return done(null, false, req.flash('errorMessage', 'Missing profile data'))
            } else {
                User.findOne({
                    fortyTwoId: profile.id,
                }).then((user, error) => {
                    if (user) {
                        console.log('success: user logged in');
                        return done(null, user, req.flash('successMessage', 'User logged in'))
                    } else if (error) {
                        console.log(error);
<<<<<<< HEAD
                        return done(null, error);
=======
                        return done(error, false);
>>>>>>> fk-dev
                    } else {
                        User.findOne({
                            email: profile._json.email
                        }).then((user, error) => {
                            if (user) {
<<<<<<< HEAD
                                console.log('email already taken');
                                return done(null, false, req.flash('errorMessage', 'Email already taken'))
                            } else if (error) {
                                console.log(error);
                                return done(null, error);
=======
                                User.findOneAndUpdate({
                                    email: profile._json.email
                                }, {fortyTwoId: profile._json.id}).then((updated, error) => {
                                    if (error) {
                                        console.log(error);
                                        return done(error, false);
                                    } else if (updated) {
                                        console.log('success: user info updated');
                                        return done(null, updated, req.flash('successMessage', 'User info updated'))
                                    } else {
                                        console.log('error: user not found');
                                        return done(null, false, req.flash('errorMessage', 'User not found'))
                                    }
                                })
                            } else if (error) {
                                console.log(error);
                                return done(error, false);
>>>>>>> fk-dev
                            } else {
                                let validationToken = Math.random().toString(36).substr(2, 9);
                                User.create({
                                    acc_id: Math.random().toString(36).substr(2, 9),
                                    email: xss(profile._json.email),
                                    username: xss(profile._json.login) + Math.random().toString().substr(5, 3),
                                    password: 'P' + Math.random().toString(36).substr(2, 11),
                                    firstname: xss(profile._json.first_name),
                                    lastname: xss(profile._json.last_name),
                                    validation: true,
                                    validationToken: validationToken,
                                    resetToken: null,
                                    lang: 'en',
                                    googleId: null,
                                    githubId: null,
                                    fortyTwoId: profile._json.id,
                                    accessToken: accessToken,
                                    profilePic: profile._json.image_url
                                }).then((isCreated) => {
                                    if (!isCreated) {
                                        console.log('error while creating user');
                                        return done(null, user, req.flash('errorMessage', 'User not created'))
                                    } else {
                                        console.log('success: user created');
                                        return done(null, user, req.flash('successMessage', 'User created'))
                                    }
                                });
                            }
                        })
                    }
                })
            }
        }
    ));


    passport.serializeUser((user, done) => {
        done(null, user.id);
    }); // used to serialize the user for the session

    passport.deserializeUser((id, done) => {
<<<<<<< HEAD
        User.findById(id, (error, user) => {
            done(error, user);
=======
        User.findById(id, (user, error) => {
            done(user, error);
>>>>>>> fk-dev
        });
    }); // used to deserialize the user for the session
};
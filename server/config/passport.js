const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
let config = require('../oAuth/config.js');
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
                } else { // send the data to schema
                    let validationToken = Math.random().toString(36).substr(2, 9);
                    User.create({
                        acc_id: Math.random().toString(36).substr(2, 9),
                        email: email,
                        username: req.body.username,
                        password: password,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        validation: false,
                        validationToken: validationToken,
                        resetToken: null,
                        lang: 'en',
                        googleId: null,
                        profilePic: null
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
                    return done(null, error)
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
    passport.use('google', new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: '/home',
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
            console.log("done that");
            console.log(profile._json);
            console.log(accessToken);
            console.log(refreshToken);
            if (!profile) {
                console.log('error: missing profile data');
                return done(null, false, req.flash('errorMessage', 'Missing profile data'))
            } else {
                User.findOne({
                    googleId: profile.id,
                    email: profile._json.email,
                    username: profile.displayName.replace(/\s/g, "")
                }).then((user, error) => {
                    if (user) {
                        console.log('user info already taken');
                        return done(null, false, req.flash('errorMessage', 'User already taken'))
                    } else if (error) {
                        console.log(error);
                        return done(null, error);
                    } else {
                        let validationToken = Math.random().toString(36).substr(2, 9);
                        User.create({
                            acc_id: Math.random().toString(36).substr(2, 9),
                            email: profile._json.email,
                            username: profile.displayName.replace(/\s/g, ""),
                            password: 'Password124',
                            firstname: profile._json.given_name,
                            lastname: profile._json.family_name,
                            validation: profile._json.email_verified,
                            validationToken: validationToken,
                            resetToken: null,
                            lang: profile._json.locale,
                            googleId: profile.id,
                            profilePic: profile._json.picture
                        }).then((isCreated) => {
                            if (!isCreated) {
                                console.log('error while creating user');
                                 return done(null, user, req.flash('errorMessage', 'User not created'))
                            } else {
                                console.log('user created');
                                return done(null, user, req.flash('successMessage', 'User created'))
                            }
                        })
                    }
                })
            }
        })
    );


    passport.serializeUser((user, done) => {
        done(null, user.id);
    }); // used to serialize the user for the session

    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user);
        });
    }); // used to deserialize the user for the session
};
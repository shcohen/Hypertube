const LocalStrategy = require('passport-local').Strategy;
const mailUtils = require('../utils/mailUtils');
const User = require('../models/user'); // load up the user model

module.exports = (passport) => {
    /* local sign-up form */
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true, // access the request object in the callback
        }, (req, email, password, done) => { // retrieve the data
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
                        validationToken: validationToken
                    }).then(() => {
                        mailUtils.sendValidationMail(email, validationToken);
                        console.log('user created');
                        return done(null, user, req.flash('successMessage', 'User created'))
                    })
                }
            })
        })
    );

    passport.use('local-signin', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true, // access the request object in the callback
        }, (req, username, password, done) => { // retrieve the data
            User.findOne({
                username: username
            }).then(user => { // check if user exists + user info in database
                if (!user || username !== user.username) {
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

    passport.serializeUser((user, done) => {
        done(null, user.id);
    }); // used to serialize the user for the session

    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user);
        });
    }); // used to deserialize the user for the session
};
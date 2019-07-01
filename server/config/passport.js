const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // load up the user model

module.exports = (passport) => {
    /* local sign-up form */
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            userField: 'username',
            passwordField: 'password',
            firstnameField: 'firstname',
            lastnameField: 'lastname',
            passReqToCallback: true, // access the request object in the callback
            session: false
        }, (req, email, password, done) => { // retrieve the data
            User.findOne({
                email: email
            }).then(acc => {
                if (acc !== null) {
                    console.log('email already taken');
                    return done(null, false, req.flash('errorMessage', 'Email already taken'))
                } else { // send the data to schema
                    User.create({
                        email: email,
                        username: req.body.username,
                        password: password,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    }).then(() => {
                        console.log('user created');
                        return done(null, acc, req.flash('successMessage', 'User created'))
                    })
                }
            })
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    }); // used to serialize the user for the session

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    }); // used to deserialize the user for the session
};
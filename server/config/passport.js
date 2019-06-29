const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // load up the user model

module.exports = (passport) => {
    /* local sign-up form */
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, (email, password, done) => { // retrieve the data
            User.findOne({
                email: email
            }).then(acc => {
                if (acc !== null) {
                    console.log('email already taken');
                    return done(null, false, {message: 'Email already taken'})
                } else {
                    User.create({email: email, password: password}) // send the data to schema
                        .then(() => {
                            console.log('user created');
                            return done(null, acc, {message: 'User created'})
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
    }); // used to deserialize the user
};
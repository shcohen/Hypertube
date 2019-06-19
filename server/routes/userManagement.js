const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

module.exports = {
    register: (req, res) => {
        console.log('starting here');
        let {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).send('invalid request')
        } else {
            console.log('email:', email, '; pwd:', password);
            return passport.use(
                'register', new LocalStrategy({
                    emailField: email,
                    passwordField: password,
                    session: false
                }, (email, password) => {
                    try {
                        console.log('hello there');
                        User.findOne({
                            where: {
                                email: email
                            }
                        }).then(user => {
                            if (user !== null) {
                                console.log('username already taken');
                                return res.status(200).send('username already taken')
                            } else {
                                User.create({email: email, password: User.hashPassword(password)})
                                    .then(() => {
                                        console.log('user created');
                                        return res.status(200).send('user created')
                                    })
                            }
                        })
                    } catch (e) {
                        throw e;
                    }
                })
            );
        }
    },
    authenticate: (req, res) => {
        User.authenticate()
    }
};
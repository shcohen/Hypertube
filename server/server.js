const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const apiRouter = require('./apiRouter').router;
const flash = require("connect-flash");
const session = require('express-session');
const config = require('./config/private/config');

// connecting to database
mongoose.connect('mongodb://localhost/db')
    .then(() => {
        console.log('Connected to mongoDB')
    }).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

const app = express();

// passport configuration
require('./config/passport')(passport);

// tells app to parse HTTP body messages
let urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(session({
    cookie: {maxAge: 60000},
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));

// routes
app.use(flash());
app.use('/api/', apiRouter);

// start
const API_PORT = process.env.API_PORT || 8080;
app.listen(API_PORT, console.log(`Listening on port ${API_PORT}`));
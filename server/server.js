const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const apiRouter = require('./apiRouter').router;
const flash = require("connect-flash");
const session = require('express-session');
const config = require('./config/private/config');
<<<<<<< HEAD

// connecting to database
mongoose.connect('mongodb://localhost/db')
    .then(() => {
        console.log('Connected to mongoDB')
    }).catch(e => {
=======
const cors = require('cors');
const CronJob = require('cron').CronJob;

global.HOME_DIR = __dirname.replace('/server', '');

// connecting to database
mongoose.connect('mongodb+srv://root:root@hypertube-yfmfl.mongodb.net/Hypertube?retryWrites=true&w=majority', {useNewUrlParser: true})
  .then(() => {
      console.log('Connected to mongoDB')
  }).catch(e => {
>>>>>>> fk-dev
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
<<<<<<< HEAD
app.use(urlencodedParser);
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

=======
app.use(cors());
app.use(urlencodedParser);
app.use(bodyParser.json());

>>>>>>> fk-dev
// flash
app.use(session({
    cookie: {maxAge: 60000},
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));

<<<<<<< HEAD
// routes
app.use(flash());
app.use('/api/', apiRouter);

// start
const API_PORT = process.env.API_PORT || 8080;
=======
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(flash());
app.use('/home', (req, res) => {
  res.redirect('http://localhost:3000/#HYPER');
});
app.use('/api/', apiRouter);

// start
const API_PORT = process.env.API_PORT || 5000;
>>>>>>> fk-dev
app.listen(API_PORT, console.log(`Listening on port ${API_PORT}`));
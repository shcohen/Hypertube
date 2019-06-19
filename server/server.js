const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const apiRouter = require('./apiRouter');

// Connexion à la base de données
mongoose.connect('mongodb://localhost/db')
    .then(() => {
        console.log('Connected to mongoDB')
    }).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

const app = express();

// Body Parser
let urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/', apiRouter);

// Lancement du site
const API_PORT = process.env.API_PORT || 8080;
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
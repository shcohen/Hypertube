const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;
const torrentSearch = require('torrent-search-api');
const mongoose = require('mongoose');
const providers = ['1337x', 'Rarbg'];
const CronJob = require('cron').CronJob;
const {updateTrends} = require('./Routes/libraryManagement');
const app = express();
// updateTrends();

mongoose.connect('mongodb://localhost/db')
    .then(() => {
        console.log('Connected to mongoDB')
    }).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

new CronJob('* * * * *', () => {
    if (updateTrends() === -1) {
        console.log('Failed to update trends');
    } else {
        console.log('Trends updated');
    }
}, null, true, 'America/Los_Angeles');

let urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());

providers.map(provider => {
    torrentSearch.enableProvider(provider);
});

app.use('/api', apiRouter);

const API_PORT = process.env.API_PORT || 6000;
app.listen(API_PORT, console.log(`Listening on port ${API_PORT}`));
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

new CronJob('* 1 * * *', () => {
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

app.use('/', (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end('<video src="http://localhost:3000/api/torrent/download_torrent/bWFnbmV0Oj94dD11cm46YnRpaDozOTAzMDA0ODIzRTAyRjQ2RDNDM0VFMUEwMTJBRjU4QUIyRDlDMEQ4JmRuPVkrdHUrbWFtJTI2YWFjdXRlJTNCK3RhbWJpJTI2ZWFjdXRlJTNCbitEVkRSaXArWHZpZCtMS1JHJnRyPWh0dHAlM0ElMkYlMkZleG9kdXMuMTMzN3gub3JnJTJGYW5ub3VuY2UmdHI9aHR0cCUzQSUyRiUyRm5lbWVzaXMuMTMzN3gub3JnJTJGYW5ub3VuY2UmdHI9aHR0cCUzQSUyRiUyRnBvdzcuY29tJTNBODAlMkZhbm5vdW5jZSZ0cj1odHRwJTNBJTJGJTJGdHJhY2tlci5wdWJsaWNidC5jb20lMkZhbm5vdW5jZSZ0cj1odHRwJTNBJTJGJTJGZ2VuZXNpcy4xMzM3eC5vcmclM0ExMzM3JTJGYW5ub3VuY2UmdHI9aHR0cCUzQSUyRiUyRjEwLnJhcmJnLmNvbSUzQTgwJTJGYW5ub3VuY2UmdHI9dWRwJTNBJTJGJTJGdHJhY2tlci4xMzM3eC5vcmclM0E4MCUyRmFubm91bmNlJnRyPXVkcCUzQSUyRiUyRnRyYWNrZXIuemVyMGRheS50byUzQTEzMzclMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLmxlZWNoZXJzLXBhcmFkaXNlLm9yZyUzQTY5NjklMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkZjb3BwZXJzdXJmZXIudGslM0E2OTY5JTJGYW5ub3VuY2UK" controls></video>');
});

const API_PORT = process.env.API_PORT || 3000;
app.listen(API_PORT, console.log(`Listening on port ${API_PORT}`));
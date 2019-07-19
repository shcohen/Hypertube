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
    res.end('<video src="http://localhost:3000/api/torrent/download_torrent/bWFnbmV0Oj94dD11cm46YnRpaDo3NjQzRDA2MjVERUQwQTVGQzk2N0IzN0E5RDZBRjY5OTAyMzZDMTgwJmRuPUF2ZW5nZXJzJTNBK0luZmluaXR5K1dhcislMjgyMDE4JTI5KyU1QldFQlJpcCU1RCslNUIxMDgwcCU1RCslNUJZVFMlNUQrJTVCWUlGWSU1RCZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLmNvcHBlcnN1cmZlci50ayUzQTY5NjklMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkY5LnJhcmJnLmNvbSUzQTI3MTAlMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkZwNHAuYXJlbmFiZy5jb20lM0ExMzM3JnRyPXVkcCUzQSUyRiUyRnRyYWNrZXIubGVlY2hlcnMtcGFyYWRpc2Uub3JnJTNBNjk2OSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLmludGVybmV0d2FycmlvcnMubmV0JTNBMTMzNyZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLm9wZW50cmFja3Iub3JnJTNBMTMzNyUyRmFubm91bmNlJnRyPXVkcCUzQSUyRiUyRnRyYWNrZXIuemVyMGRheS50byUzQTEzMzclMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLmxlZWNoZXJzLXBhcmFkaXNlLm9yZyUzQTY5NjklMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkZjb3BwZXJzdXJmZXIudGslM0E2OTY5JTJGYW5ub3VuY2U=" controls></video>');
});

const API_PORT = process.env.API_PORT || 3000;
app.listen(API_PORT, console.log(`Listening on port ${API_PORT}`));
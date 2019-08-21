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

// app.use(express.static('./'));

mongoose.connect('mongodb+srv://root:root@hypertube-yfmfl.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
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

// app.use('/', (req, res) => {
//     res.writeHead(200, {"Content-Type": "text/html"});
//     res.end('<video crossorigin="anonymous" controls> ' +
//         '<source src="http://localhost:3000/api/torrent/download_torrent/Django_Unchained/bWFnbmV0Oj94dD11cm46YnRpaDo1QTMzRkU2MzA1OTUxQTQyMENBMzBBNkE1RkYyRTQ4QzZGQjRDN0YxJmRuPURqYW5nbytVbmNoYWluZWQrJTI4MjAxMiUyOSsxMDgwcCtCclJpcCt4MjY0Ky0rWUlGWSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLnlpZnktdG9ycmVudHMuY29tJTJGYW5ub3VuY2UmdHI9dWRwJTNBJTJGJTJGdHJhY2tlci4xMzM3eC5vcmclM0E4MCUyRmFubm91bmNlJnRyPXVkcCUzQSUyRiUyRmV4b2R1cy5kZXN5bmMuY29tJTNBNjk2OSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLmlzdG9sZS5pdCUzQTgwJnRyPXVkcCUzQSUyRiUyRnRyYWNrZXIuY2NjLmRlJTNBODAlMkZhbm5vdW5jZSZ0cj1odHRwJTNBJTJGJTJGZnIzM2RvbS5oMzN0LmNvbSUzQTMzMTAlMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLnB1YmxpY2J0LmNvbSUzQTgwJnRyPXVkcCUzQSUyRiUyRmNvcHBlcnN1cmZlci50ayUzQTY5NjklMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLm9wZW5iaXR0b3JyZW50LmNvbSUzQTgwJTJGYW5ub3VuY2UmdHI9dWRwJTNBJTJGJTJGdHJhY2tlci56ZXIwZGF5LnRvJTNBMTMzNyUyRmFubm91bmNlJnRyPXVkcCUzQSUyRiUyRnRyYWNrZXIubGVlY2hlcnMtcGFyYWRpc2Uub3JnJTNBNjk2OSUyRmFubm91bmNlJnRyPXVkcCUzQSUyRiUyRmNvcHBlcnN1cmZlci50ayUzQTY5NjklMkZhbm5vdW5jZQ">' +
//         '<track label="French" kind="subtitles" src="./Subtitles/tt1853728/tt1853728.fr.vtt" srclang="fr">' +
//         '</video>');
// });

app.use('/api/ping', (req, res) => {
    console.log('pong');
    res.send('pong');
});

const API_PORT = process.env.API_PORT || 5000;
app.listen(API_PORT, console.log(`Listening on port ${API_PORT}`));

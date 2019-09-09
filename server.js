const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;
const torrentSearch = require('torrent-search-api');
const mongoose = require('mongoose');
const providers = ['1337x', 'Rarbg'];
const cors = require('cors');
const CronJob = require('cron').CronJob;
const {downloadedMoviesExpirationCheck} = require('./utils/moviesUtils');
const app = express();
// updateTrends();
downloadedMoviesExpirationCheck();
// app.use(express.static('./'));

mongoose.connect('mongodb+srv://root:root@hypertube-yfmfl.mongodb.net/Hypertube?retryWrites=true&w=majority', {useNewUrlParser: true})
    .then(() => {
        console.log('Connected to mongoDB')
    }).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});
new CronJob('0 0 * * *', () => {
    downloadedMoviesExpirationCheck();
    console.log('Downloaded movies daily check done');
}, null, true, 'Europe/Paris');

let urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(cors());
app.use(urlencodedParser);
app.use(bodyParser.json());

providers.map(provider => {
    torrentSearch.enableProvider(provider);
});


app.use('/api', apiRouter);

app.use('/test', (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end('<video crossorigin="anonymous" controls> ' +
        '<source src="http://localhost:5000/api/torrent/download_torrent?movieId=tt4154796&movieNameEncoded=Avengers:%20Endgame&movieHash=223F7484D326AD8EFD3CF1E548DED524833CB77E">' +
        '<track label="French" kind="subtitles" src="./Subtitles/tt1853728/tt1853728.fr.vtt" srclang="fr">' +
        '</video>');
});

app.use('/api/ping', (req, res) => {
    console.log('pong');
    res.send('pong');
});

const API_PORT = process.env.API_PORT || 5000;
app.listen(API_PORT, console.log(`Listening on port ${API_PORT}`));

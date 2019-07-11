const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;
const torrentSearch = require('torrent-search-api');
const providers = ['1337x', 'KickassTorrents', 'ThePirateBay', 'ExtraTorrent'];
const app = express();

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
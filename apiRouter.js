const express = require('express');
const libraryManagement = require('./Routes/libraryManagement');
const torrentManagement = require('./Routes/torrentManagement');

exports.router = (() => {
    const apiRouter = express.Router();

    /* MOVIE LIBRARY */
    apiRouter.route('/library/find_movie').post(libraryManagement.findMovies);
    apiRouter.route('/library/find_movie_info').post(libraryManagement.findMovieInfo);
    apiRouter.route('/library/get_trends').get(libraryManagement.getTrends);

    /* TORRENT */
    apiRouter.route('/torrent/get_torrent').post(torrentManagement.findTorrent);
    apiRouter.route('/torrent/download_torrent/:movieTitle/:magnet').get(torrentManagement.torrentManager);

    return apiRouter;
})();
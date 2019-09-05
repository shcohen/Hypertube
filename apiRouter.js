const express = require('express');
const libraryManagement = require('./Routes/libraryManagement');
const torrentManagement = require('./Routes/torrentManagement');
const subtitleManagement = require('./Routes/subtitleManagement');

exports.router = (() => {
    const apiRouter = express.Router();

    /* MOVIE LIBRARY */
    apiRouter.route('/library/find_movie').post(libraryManagement.libraryManager);
    apiRouter.route('/library/find_movie_info').get(libraryManagement.findMovieInfo);

    /* TORRENT */
    apiRouter.route('/torrent/download_torrent').get(torrentManagement.torrentManager);


    /* SUBTITLES */
    apiRouter.route('/subtitles/get_subtitles').get(subtitleManagement.subtitleManager);
    return apiRouter;
})();
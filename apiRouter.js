const express = require('express');
const libraryManagement = require('./Routes/libraryManagement');

exports.router = (() => {
    const apiRouter = express.Router();

    /* TORRENT LIBRARY */
    apiRouter.route('/library/find_movie').post(libraryManagement.findMovies);
    apiRouter.route('/library/find_movie_info').post(libraryManagement.findMovieInfo);
    apiRouter.route('/library/get_trends').get(libraryManagement.getTrends);

    return apiRouter;
})();
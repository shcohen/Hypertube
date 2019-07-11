const express = require('express');
const libraryManagement = require('./Routes/libraryManagement');

exports.router = (() => {
    const apiRouter = express.Router();

    /* TORRENT LIBRARY */
    apiRouter.route('/library/find_movie').post(libraryManagement.findMovies);

    return apiRouter;
})();
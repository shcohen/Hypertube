const mongoose = require('mongoose');

let watchedMovieSchema = new mongoose.Schema({
    accId: {
        type: String,
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    date: {
        type: Date
    }
});

module.exports = mongoose.model('watchedMovie', watchedMovieSchema);
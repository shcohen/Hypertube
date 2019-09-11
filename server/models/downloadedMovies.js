const mongoose = require('mongoose');

let downloadedMoviesSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    date: {
        type: Date
    }
});

module.exports = mongoose.model('downloadedMovies', downloadedMoviesSchema);
const mongoose = require('mongoose');

let downloadedMoviesSchema = new mongoose.Schema({
    movieId: {
        type: String,
        require: true,
        trim: true
    },
    path: {
        type: String,
        require: true,
        trim: true
    },
    date: {
        type: Date
    }
});

module.exports = mongoose.model('downloadedMovies', downloadedMoviesSchema);
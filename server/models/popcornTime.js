const mongoose = require('mongoose');

let popcornTimesMoviesSchema = new mongoose.Schema({
    imdb_code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    genres: {
        type: Array,
        required: true
    },
    year: {
        type: String
    },
    synopsis: {
        type: String
    },
    trailer: {
        type: String
    },
    runtime: {
        type: String,
        required: true
    },
    torrents: {
        type: Object,
        required: true
    },
    large_cover_image: {
        type: String
    },
    rating: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('popcornTimesMovies', popcornTimesMoviesSchema);
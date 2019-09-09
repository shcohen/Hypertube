const mongoose = require('mongoose');

let trendsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    poster: {
        type: String,
        require: true,
        trim: true
    },
    genre: {
        type: Array,
        require: true
    },
    note: {
        type: String,
        require: true
    },
    imdbID: {
        type: String,
        require: true
    },
    release_date: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Trends', trendsSchema);
const mongoose = require('mongoose');

let movieWatchedSchema = new mongoose.Schema({
    movieId: {
        type: String,
        require: true,
        trim: true
    },
    accId: {
        type: String,
        require: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('movieWatched', movieWatchedSchema);
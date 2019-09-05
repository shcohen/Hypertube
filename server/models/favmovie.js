const mongoose = require('mongoose');

let favMovieSchema = new mongoose.Schema({
    acc_id: {
        type: String,
        required: true
    },
    movie_id: {
        type: String,
        required: true
    }
}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('favMovie', favMovieSchema);
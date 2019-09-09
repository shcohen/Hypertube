const mongoose = require('mongoose');

let subtitleSchema = new mongoose.Schema({
    film: {
        type: String,
        require: true,
        trim: true
    },
    language: {
        type: String,
        require: true,
        trim: true
    },
    path: {
        type: String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('Subtitle', subtitleSchema);
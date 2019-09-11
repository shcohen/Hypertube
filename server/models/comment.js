const mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
    post_id: {
        type: String,
        required: true
    },
    acc_id: {
        type: String,
        required: true
    },
    movie_id: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('Comment', commentSchema);
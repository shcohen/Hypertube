const Comment = require('../models/comment');
const User = require('../models/user');
const xss = require('xss');

module.exports = {
    createComment: (req, res) => {
        let {acc_id, movie_id, message} = req.body;
        if (!acc_id || !movie_id || !message) {
            console.log(req.body);
            return res.status(200).send('error: invalid request')
        } else if (acc_id.type && typeof acc_id.type !== 'string' || movie_id.type && typeof movie_id.type !== 'string'
            || message.type && typeof message.type !== 'string') {
            console.log(req.body);
            return res.status(200).send('error: invalid request')
        } else {
            User.findOne({
                acc_id: acc_id
            }).then((user, error) => {
                if (error) {
                    console.log(error);
                    return res.status(200).send('error: account not found')
                } else if (user) {
                    Comment.create({
                        post_id: Math.random().toString(36).substr(2, 9),
                        acc_id: acc_id,
                        movie_id: movie_id,
                        message: xss(message)
                    }).then((isStored, error) => {
                        if (error) {
                            console.log(error);
                            return res.status(200).send('error: comment not stored')
                        } else if (isStored) {
                            return res.status(200).send('success: comment stored')
                        }
                    })
                }
            })
        }
    },
    modifyComment: (req, res) => {
        let {post_id, acc_id, movie_id, message} = req.body;
        if (!post_id || !acc_id || !movie_id || !message) {
            console.log(req.body);
            return res.status(200).send('error: invalid request')
        } else {
            User.findOne({
                acc_id: acc_id
            }).then((user, error) => {
                if (error) {
                    console.log(error);
                    return res.status(200).send('error: account not found')
                } else if (user) {
                    Comment.findOneAndUpdate({
                        post_id: xss(post_id),
                        acc_id: xss(acc_id),
                        movie_id: xss(movie_id),
                        message: xss(message)
                    }).then((isModified, error) => {
                        if (error) {
                            console.log(error);
                            return res.status(200).send('error: comment not modified')
                        } else if (isModified) {
                            return res.status(200).send('success: comment modified')
                        }
                    })
                }
            })
        }
    },
    deleteComment: (req, res) => {
        let {post_id, acc_id} = req.body;
        if (!post_id || !acc_id) {
            console.log(req.body);
            return res.status(200).send('error: invalid request')
        } else {
            User.findOne({
                acc_id: acc_id
            }).then((user, error) => {
                if (error) {
                    console.log(error);
                    return res.status(200).send('error: account not found')
                } else if (user) {
                    Comment.findOneAndDelete({
                        post_id: xss(post_id),
                        acc_id: xss(acc_id)
                    }).then((isDeleted, error) => {
                        if (error) {
                            console.log(error);
                            return res.status(200).send('error: comment not deleted')
                        } else if (isDeleted) {
                            return res.status(200).send('success: comment deleted')
                        }
                    })
                }
            })
        }
    }
};
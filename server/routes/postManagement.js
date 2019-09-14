const Comment = require('../models/comment');
const User = require('../models/user');
const Movies = require('../models/watchedMovie');
const {getUserInfos} = require('../utils/jwt_check');
const xss = require('xss');

module.exports = {
    getWatchedMovies: (req, res) => {
        let checkMovie = {};
        let {acc_id} = req.query;
        if (!acc_id) {
            checkMovie.errorMessage = 'Invalid request';
            return res.status(400).send(checkMovie)
        } else {
            User.findOne({
                acc_id: acc_id
            }).then((user, error) => {
                if (error) {
                    return res.status(500).send('error: ', error)
                } else if (user) {
                    Movies.find({
                        accId: acc_id
                    }).then((seen, error) => {
                        if (error) {
                            return res.status(500).send('error: ', error)
                        } else if (seen.length) {
                            res.status(200).send(seen)
                        } else {
                            checkMovie.errorMessage = 'No movies watched yet';
                            return res.status(200).send([]);
                        }
                    })
                } else {
                    checkMovie.errorMessage = 'Account not found';
                    return res.status(401).send(checkMovie);
                }
            })
        }
    },
    getComments: (req, res) => {
        let checkComment = {};
        const connectedUser = getUserInfos(req.headers.authorization);
        if (!connectedUser)
            res.status(401).send('Unauthorized');
        const {acc_id} = connectedUser;
        const {movie_id} = req.query;
        if (!acc_id || !movie_id) {
            checkComment.errorMessage = 'Invalid request';
            return res.status(400).send(checkComment);
        } else {
            User.findOne({
                acc_id: acc_id
            }).then((user, error) => {
                if (error) {
                    return res.status(500).send('error: ', error)
                } else if (user) {
                    Comment.find({
                        movie_id: xss(movie_id)
                    }).then((allComments, error) => {
                        if (error) {
                            return res.status(500).send('error: ', error);
                        } else if (allComments.length) {
                            return res.status(200).send(allComments);
                        } else {
                            checkComment.errorMessage = 'Comments not found';
                            return (res.status(200).send([]))
                        }
                    })
                } else {
                    checkComment.errorMessage = 'Account not found';
                    return (res.status(401).send(checkComment))
                }
            });
        }
    },
    createComment: (req, res) => {
        let checkComment = {};
        const connectedUser = getUserInfos(req.headers.authorization);
        if (!connectedUser) {
            res.status(401).send('Unauthorized')
        } else {
            let acc_id = connectedUser.acc_id;
            let {movie_id, message} = req.body;
            if (!acc_id || !movie_id || !message) {
                checkComment.errorMessage = 'Invalid request';
                return res.status(400).send(checkComment)
            } else {
                User.findOne({
                    acc_id: acc_id
                }).then((user, error) => {
                    if (error) {
                        return res.status(500).send('error: ', error)
                    } else if (user) {
                        Comment.create({
                            post_id: Math.random().toString(36).substr(2, 9),
                            acc_id: acc_id,
                            movie_id: movie_id,
                            message: xss(message)
                        }).then((isStored, error) => {
                            if (error) {
                                return res.status(500).send('error: ', error)
                            } else if (isStored) {
                                checkComment.successMessage = 'Comment stored';
                                return res.status(201).send(checkComment)
                            } else {
                                checkComment.errorMessage = 'Comment not stored';
                                return res.status(500).send(checkComment);
                            }
                        })
                    } else {
                        checkComment.errorMessage = 'Account not found';
                        return res.status(401).send(checkComment)
                    }
                })
            }
        }
    },
    modifyComment: (req, res) => {
        let checkComment = {};
        const connectedUser = getUserInfos(req.headers.authorization);
        if (!connectedUser) {
            res.status(401).send('Unauthorized')
        } else {
            let acc_id = connectedUser.acc_id;
            let {post_id, movie_id, message} = req.body;
            if (!post_id || !acc_id || !movie_id || !message) {
                checkComment.errorMessage = 'Invalid request';
                return res.status(400).send(checkComment)
            } else {
                User.findOne({
                    acc_id: acc_id
                }).then((user, error) => {
                    if (error) {
                        return res.status(500).send('error: ', error)
                    } else if (user) {
                        Comment.findOneAndUpdate({
                            post_id: xss(post_id),
                            acc_id: xss(acc_id),
                            movie_id: xss(movie_id),
                            message: xss(message)
                        }).then((isModified, error) => {
                            if (error) {
                                return res.status(500).send('error: ', error)
                            } else if (isModified) {
                                checkComment.successMessage = 'Comment modified';
                                return res.status(200).send(checkComment)
                            } else {
                                checkComment.errorMessage = 'Comment not modified';
                                return res.status(500).send(checkComment)
                            }
                        })
                    } else {
                        checkComment.errorMessage = 'Account not found';
                        return res.status(401).send(checkComment)
                    }
                })
            }
        }
    },
    deleteComment: (req, res) => {
        let checkComment = {};
        const connectedUser = getUserInfos(req.headers.authorization);
        if (!connectedUser) {
            res.status(401).send('Unauthorized')
        } else {
            let acc_id = connectedUser.acc_id;
            let {post_id} = req.body;
            if (!post_id || !acc_id) {
                checkComment.errorMessage = 'Invalid request';
                return res.status(400).send(checkComment)
            } else {
                User.findOne({
                    acc_id: acc_id
                }).then((user, error) => {
                    if (error) {
                        return res.status(401).send('error: ', error)
                    } else if (user) {
                        Comment.findOneAndDelete({
                            post_id: xss(post_id),
                            acc_id: xss(acc_id)
                        }).then((isDeleted, error) => {
                            if (error) {
                                return res.status(500).send('error: ', error)
                            } else if (isDeleted) {
                                checkComment.successMessage = 'Comment deleted';
                                return res.status(200).send(checkComment)
                            } else {
                                checkComment.errorMessage = 'Comment not deleted';
                                return res.status(500).send(checkComment)
                            }
                        })
                    } else {
                        checkComment.errorMessage = 'Account not found';
                        return res.status(401).send(checkComment)
                    }
                })
            }
        }
    }
};
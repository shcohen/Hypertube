const Comment = require('../models/comment');
const User = require('../models/user');
const favMovie = require('../models/favmovie');
const xss = require('xss');

module.exports = {
    addMovieToFav: (req, res) => {
        let {acc_id, movie_id} = req.body;
        if (!acc_id || !movie_id) {
            return res.status(400).send('error: invalid request')
        } else {
            User.findOne({
                acc_id: acc_id
            }).then((user, error) => {
                if (error) {
                    console.log(error);
                    return res.status(401).send('error: account not found')
                } else if (user) {
                    favMovie.create({
                        acc_id: acc_id,
                        movie_id: movie_id
                    }).then((isAdded, error) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).send('error: movie was not added to favorites')
                        } else if (isAdded) {
                            return res.status(201).send('success: movie was added to Favorites')
                        }
                    })
                }
            })
        }
    },
    displayFavMovies: (req, res) => {
        let {acc_id} = req.body;
        if (!acc_id) {
            return res.status(400).send('error: invalid request')
        } else {
            User.findOne({
                acc_id: acc_id
            }).then((user, error) => {
                if (error) {
                    console.log(error);
                    return res.status(401).send('error: account not found')
                } else if (user) {
                    favMovie.find({
                        acc_id: acc_id
                    }).then((favMovies, error) => {
                        if (error) {
                            console.log(error);
                            return res.status(400).send('error: invalid request')
                        } else if (favMovies) {
                            let favMaps = {};
                            favMovies.forEach((fav) => {
                                favMaps[fav._id] = fav;
                            });
                            return res.send(favMaps)
                        }
                    })
                } else {
                    return res.status(200).send('no movies was added as favorites');
                }
            })
        }
    },
    createComment: (req, res) => {
        let {acc_id, movie_id, message} = req.body;
        if (!acc_id || !movie_id || !message) {
            return res.status(400).send('error: invalid request')
        } else {
            User.findOne({
                acc_id: acc_id
            }).then((user, error) => {
                if (error) {
                    console.log(error);
                    return res.status(401).send('error: account not found')
                } else if (user) {
                    Comment.create({
                        post_id: Math.random().toString(36).substr(2, 9),
                        acc_id: acc_id,
                        movie_id: movie_id,
                        message: xss(message)
                    }).then((isStored, error) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).send('error: comment not stored')
                        } else if (isStored) {
                            return res.status(201).send('success: comment stored')
                        }
                    })
                }
            })
        }
    },
    modifyComment:
        (req, res) => {
            let {post_id, acc_id, movie_id, message} = req.body;
            if (!post_id || !acc_id || !movie_id || !message) {
                return res.status(400).send('error: invalid request')
            } else {
                User.findOne({
                    acc_id: acc_id
                }).then((user, error) => {
                    if (error) {
                        console.log(error);
                        return res.status(401).send('error: account not found')
                    } else if (user) {
                        Comment.findOneAndUpdate({
                            post_id: xss(post_id),
                            acc_id: xss(acc_id),
                            movie_id: xss(movie_id),
                            message: xss(message)
                        }).then((isModified, error) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send('error: comment not modified')
                            } else if (isModified) {
                                return res.status(200).send('success: comment modified')
                            }
                        })
                    }
                })
            }
        },
    deleteComment:
        (req, res) => {
            let {post_id, acc_id} = req.body;
            if (!post_id || !acc_id) {
                console.log(req.body);
                return res.status(400).send('error: invalid request')
            } else {
                User.findOne({
                    acc_id: acc_id
                }).then((user, error) => {
                    if (error) {
                        console.log(error);
                        return res.status(401).send('error: account not found')
                    } else if (user) {
                        Comment.findOneAndDelete({
                            post_id: xss(post_id),
                            acc_id: xss(acc_id)
                        }).then((isDeleted, error) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send('error: comment not deleted')
                            } else if (isDeleted) {
                                return res.status(200).send('success: comment deleted')
                            }
                        })
                    }
                })
            }
        }
};
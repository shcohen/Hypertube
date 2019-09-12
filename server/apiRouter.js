const express = require('express');
const fs = require('fs');
const userManagement = require('./routes/userManagement');
const postManagement = require('./routes/postManagement');
const libraryManagement = require('./routes/libraryManagement');
const torrentManagement = require('./routes/torrentManagement');
const subtitleManagement = require('./routes/subtitleManagement');
const strategies = require('./oAuth/strategies');
const multer = require('multer');
const uuid = require('uuid');

// set picture storage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(`${HOME_DIR}/client/public/uploads`)) {
            fs.mkdirSync(`${HOME_DIR}/client/public/uploads`);
        }
        cb(null, `${HOME_DIR}/client/public/uploads`);
    },
    filename: function (req, file, cb) {
        cb(null, `/${file.fieldname}-${uuid.v4()}.${file.mimetype.match(/(?<=\/)[a-z]+/gm)}`);
    }
});
const upload = multer({
    storage: storage, fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
            return cb(null, false)
        } else
            return cb(null, true)
    }
});
exports.router = (() => {
    const apiRouter = express.Router();

    /* ACCOUNT */
    apiRouter.route('/account/register').post(upload.single('profilePic'), userManagement.register);
    apiRouter.route('/account/validate/:id').get(userManagement.validateAccount);
    apiRouter.route('/account/login').post(userManagement.authenticate);
    apiRouter.route('/account/registerSuccess').get(userManagement.registerSuccess);
    apiRouter.route('/account/registerFailure').get(userManagement.registerFailure);
    apiRouter.route('/account/modify').post(upload.single('profilePic'), userManagement.modify);
    apiRouter.route('/account/forgot_password').post(userManagement.sendForgotPassword);
    apiRouter.route('/account/reset_password/:id').post(userManagement.resetPassword);
    apiRouter.route('/account/language').post(userManagement.changeLang);

    /* STRATEGIES */
    apiRouter.route('/account/google/').get(strategies.google);
    apiRouter.route('/account/google/redirect').get(strategies.googleRedirect);
    apiRouter.route('/account/github').get(strategies.github);
    apiRouter.route('/account/github/redirect').get(strategies.githubRedirect);
    apiRouter.route('/account/42').get(strategies.fortyTwo);
    apiRouter.route('/account/42/redirect').get(strategies.fortyTwoRedirect);
    apiRouter.route('/jwt').get(strategies.jwt);

    /* MOVIE */
    apiRouter.route('/comments').get(postManagement.getComments);
    apiRouter.route('/comments/submit').post(postManagement.createComment);
    apiRouter.route('/comments/modify').post(postManagement.modifyComment);
    apiRouter.route('/comments/delete').post(postManagement.deleteComment);
    apiRouter.route('/library/watched').get(postManagement.getWatchedMovies);

    /* MOVIE LIBRARY */
    apiRouter.route('/library/find_movie').post(libraryManagement.libraryManager);
    apiRouter.route('/library/find_movie_info').get(libraryManagement.findMovieInfo);

    /* TORRENT */
    apiRouter.route('/torrent/download_torrent').get(torrentManagement.torrentManager);

    /* SUBTITLES */
    apiRouter.route('/subtitles/get_subtitles').get(subtitleManagement.subtitleManager);

    // USER
    apiRouter.route('/profile').get(userManagement.getProfile);

    return apiRouter;
})();
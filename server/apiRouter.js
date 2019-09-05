const express = require('express');
const fs = require('fs');
const userManagement = require('./routes/userManagement');
const postManagement = require('./routes/postManagement');
const strategies = require('./oAuth/strategies');
const multer = require('multer');
// set picture storage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}.${file.mimetype.match(/(?<=\/)[a-z]+/gm)}`);
    }
});
const upload = multer({
    storage: storage, fileFilter: function (req, file, cb) {
        console.log('hello');
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
            return cb(null, false)
        // } if (getFileSize(file) <= 0 || getFileSize(file) >= 200000) {
        //     console.log('bug');
        //     return cb(null, false)
        } else
            return cb(null, true)
    }
});
exports.router = (() => {
    const apiRouter = express.Router();

    /* ACCOUNT */
    apiRouter.route('/account/register').post(upload.single('profilePic'), userManagement.register);
    apiRouter.route('/account/validate').post(userManagement.validateAccount);
    apiRouter.route('/account/login').post(userManagement.authenticate);
    apiRouter.route('/account/modify').post(upload.single('profilePic'), userManagement.modify);
    apiRouter.route('/account/forgot_password').post(userManagement.sendForgotPassword);
    apiRouter.route('/account/reset_password').post(userManagement.resetPassword);

    /* STRATEGIES */
    apiRouter.route('/account/google/').get(strategies.google);
    apiRouter.route('/home').get(strategies.googleRedirect);
    apiRouter.route('/account/github').get(strategies.github);
    apiRouter.route('/account/github/redirect').get(strategies.githubRedirect);
    apiRouter.route('/account/42').get(strategies.fortyTwo);
    apiRouter.route('/account/42/redirect').get(strategies.fortyTwoRedirect);

    /* MOVIE */
    apiRouter.route('/search/:id/submit').get(postManagement.createComment);
    apiRouter.route('/search/:id/modify').get(postManagement.modifyComment);
    apiRouter.route('/search/:id/delete').get(postManagement.deleteComment);
    apiRouter.route('/search/:id/favorites').get(postManagement.addMovieToFav);
    apiRouter.route('/favorites').get(postManagement.displayFavMovies);

    return apiRouter;
})();
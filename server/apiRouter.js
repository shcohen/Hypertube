const express = require('express');
const userManagement = require('./routes/userManagement');
const postManagement = require('./routes/postManagement');
const strategies = require('./oAuth/strategies');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

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
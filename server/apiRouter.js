const express = require('express');
const userManagement = require('./routes/userManagement');
const strategies = require('./oAuth/strategies');

exports.router = (() => {
    const apiRouter = express.Router();

    /* ACCOUNT */
    apiRouter.route('/account/register').post(userManagement.register);
    apiRouter.route('/account/validate').post(userManagement.validateAccount);
    apiRouter.route('/account/login').post(userManagement.authenticate);
    apiRouter.route('/account/modify').post(userManagement.modify);
    apiRouter.route('/account/forgot_password').post(userManagement.sendForgotPassword);
    apiRouter.route('/account/reset_password').post(userManagement.resetPassword);

    /* STRATEGIES */
    apiRouter.route('/account/google/').get(strategies.google);
    apiRouter.route('/home').get(strategies.googleRedirect);
    apiRouter.route('/account/github').get(strategies.github);
    apiRouter.route('/account/github/redirect').get(strategies.githubRedirect);

    return apiRouter;
})();
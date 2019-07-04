const express = require('express');
const userManagement = require('./routes/userManagement');

exports.router = (() => {
    const apiRouter = express.Router();

    /* ACCOUNT */
    apiRouter.route('/account/register').post(userManagement.register);
    apiRouter.route('/account/validate').post(userManagement.validateAccount);
    apiRouter.route('/account/login').post(userManagement.authenticate);
    apiRouter.route('/account/modify').post(userManagement.modify);

    return apiRouter;
})();
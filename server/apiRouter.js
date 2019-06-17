const express = require('express');
const userManagement = require('./routes/userManagement');

module.exports = (() => {
    const apiRouter = express.Router();

    /* ACCOUNT */
    apiRouter.route('/account/register').post(userManagement.register);

    return apiRouter;
})();
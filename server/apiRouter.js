const express = require('express');
const userManagement = require('./routes/userManagement');

exports.router = (() => {
    const apiRouter = express.Router();

    /* ACCOUNT */
    apiRouter.route('/account/register').post(userManagement.register);

    // app.get('/', function(req, res){
    // Get an array of flash messages by passing the key to req.flash()
    //   res.render('index', { messages: req.flash('info') });
    //});

    return apiRouter;
})();
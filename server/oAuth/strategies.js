let passport = require('passport');
// const User = require('../models/user'); // load up the user model
// let FacebookStrategy = require('passport-facebook').Strategy;
// let config = require('./config.js');

// add auto creating username because it is not provided with facebook
module.exports = {
    facebook: (req, res, next) => {
        console.log('been there');
        let {email, password} = req.body;
        if (!email || !password) {
            return res.status(200).send('invalid request')
        } else {
            console.log(req.body);
            console.log('done that');
            passport.authenticate('facebook', {
                successRedirect: '/home',
                failureRedirect: '/api/account/login',
                failureFlash: true
            })(req, res, next)
        }
    },
    facebookAuth: (req, res, next) => {
        passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/api/account/login',
            failureFlash: true
        })(req, res, next)
    }
};

// <script>
// window.fbAsyncInit = function() {
//     FB.init({
//         appId      : config.facebook.app_id,
//         cookie     : true,
//         xfbml      : true,
//         version    : v3.3
//     });
//
//     FB.AppEvents.logPageView();
//
// };
//
// (function(d, s, id){
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {return;}
//     js = d.createElement(s); js.id = id;
//     js.src = "https://connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));
// </script>

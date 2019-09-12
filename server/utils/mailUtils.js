const nodemailer = require('nodemailer');
const credentials = require('../config/private/config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: credentials.user,
        pass: credentials.pass
    }
});

function mailOptions(email, token) {
    let mailOption = {
        from: 'hypertube-no-reply@gmail.com',
        to: email,
        subject: 'Welcome to Hyper!',
        html: '<p>Click <a href="http://localhost:3000/api/account/validate/' + token + '">here</a> to validate your account!</p>'
    };
    return mailOption;
}

let resetMail = (email, token) => {
    let mail = {
        from: 'hypertube.no.reply@gmail.com',
        to: email,
        subject: 'Forgot your password? Let\'s get you a new one.',
        html: '<p>You are receiving this e-mail because you requested a password reset for your Hyper account. Click ' +
            '<a href="http://localhost:3000/api/account/reset_password/' + token + '">here</a> ' +
            'to set up a new password. If you are not the author of this request, please contact our support team.</p>'
    };
    return mail;
};

module.exports = {
    sendValidationMail: function(email, token) {
        transporter.sendMail(mailOptions(email, token), (error) => {
            if (error) {
                console.log(error);
                return false
            } else {
                console.log('success: validation mail sent');
                return true
            }
        });
    },
    resetMail: (email, token) => {
        transporter.sendMail(resetMail(email, token), (error) => {
            if (error) {
                console.log(error);
                return false
            } else {
                console.log('success: password reset mail sent');
                return true
            }
        });
    }
};


const nodemailer = require('nodemailer');
const credentials = require('../config/private/config');
const {templateEmail} = require('../template/email');

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
        subject: 'HYPER - Account verification',
        html: templateEmail('Welcome to HYPER!', 'Hi there!',
          'We are pleased to count you as a new user of our website.\nBefore logging in for the first time, please verify your account by clicking the button below.',
          'Verify my account', 'http://localhost:3000?action=validate&token=' + token)
    };
    return mailOption;
}

let resetMail = (email, token) => {
    let mail = {
        from: 'hypertube.no.reply@gmail.com',
        to: email,
        subject: 'HYPER - Password reset',
        html: templateEmail('Forgot your password? Let\'s get you a new one.', 'Hi there!',
          'You are receiving this email because you requested a password reset for your Hyper account. Click the button below to set a new password.\nIf you are not the author of this request, please contact us.',
          'Reset my password', 'http://localhost:3000?action=forgot-password&token=' + token)
    };
    return mail;
};

module.exports = {
    sendValidationMail: function(email, token) {
        transporter.sendMail(mailOptions(email, token), (error) => {
            if (error) {
                return false
            } else {
                return true
            }
        });
    },
    resetMail: (email, token) => {
        transporter.sendMail(resetMail(email, token), (error) => {
            if (error) {
                return false
            } else {
                return true
            }
        });
    }
};


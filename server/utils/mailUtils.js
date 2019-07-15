const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hypertube.no.reply@gmail.com',
        pass: 'FloShaYa42Hype'
    }
});

function mailOptions(email, token) {
    let mailOption = {
        from: 'hypertube-no-reply@gmail.com',
        to: email,
        subject: 'Welcome to Hyper!',
        html: '<p>Click <a href="http://localhost:3000/validate' + token + '">here</a> to validate your account!</p>'
    };
    return mailOption;
}

let resetMail = (email, code) => {
    let mail = {
        from: 'hypertube.no.reply.42@gmail.com',
        to: email,
        subject: 'Forgot your password? Let\'s get you a new one.',
        html: '<p>You are receiving this e-mail because you requested a password reset for your Hyper account. Click ' +
            '<a href="http://localhost:3000/reset/' + code + '">here</a> ' +
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
                console.log('success: email sent');
                return true
            }
        });
    },
    resetMail: (email, code) => {
        transporter.sendMail(resetMail(email, code), (error) => {
            if (error) {
                console.log(error);
                return false
            } else {
                console.log('success: email sent');
                return true
            }
        });
    }
};



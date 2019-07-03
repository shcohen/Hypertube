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
        subject: 'Welcome to Hypertube',
        text: 'That was easy!' + token
    };
    return mailOption;
}

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
    }
};



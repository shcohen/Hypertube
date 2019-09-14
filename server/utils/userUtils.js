const User = require("../models/user");
const validator = require("email-validator");
const passwordValidator = require("password-validator");
const schema = new passwordValidator(); // create a validation schema
schema // add properties to it
    .is().min(8)                                    // minimum length 8
    .is().max(20)                                   // maximum length 20
    .has().uppercase()                              // must have uppercase letters
    .has().lowercase()                              // must have lowercase letters
    .has().digits()                                 // must have digits
    .has().not().spaces();                          // should not have spaces

module.exports = {
    checkPassword: (password, rpassword) => {
        if (password !== rpassword) {
            return { errorCode: -1, errorMessage: 'passwords do not match' };
        } else {
            if (!schema.validate(password, { list: false })) {
                return {
                    errorCode: -1, errorMessage: 'invalid password provided: missing ' + schema.validate(password, { list: true })
                };
            } else {
                return { successCode: 1, successMessage: 'password updated successfully' }
            }
        }
    },
    checkEmail: async (email, acc_id) => {
        let emailCheck = await User.findOne({ email: email });
        if (emailCheck && emailCheck.email && emailCheck.acc_id !== acc_id) {
            return { errorCode: -1, errorMessage: 'email already taken' }
        } else if (emailCheck && emailCheck.error) {
            return { errorCode: -1, errorMessage: 'error: ' + emailCheck.error }
        } else {
            if (validator.validate(email) === true) {
                return { successCode: 1, successMessage: 'email updated successfully' }
            } else {
                return { errorCode: -1, errorMessage: 'invalid email provided' }
            }
        }
    },
    checkUsername: async (username, acc_id) => {
        let usernameCheck = await User.findOne({ username: username });
        if (usernameCheck && usernameCheck.username && usernameCheck.acc_id !== acc_id) {
            return { errorCode: -1, errorMessage: 'username already taken' }
        } else if (usernameCheck && usernameCheck.error) {
            return { errorCode: -1, errorMessage: 'error: ' + usernameCheck.error }
        } else {
            return { successCode: 1, successMessage: 'username updated successfully' }
        }
    },
    checkFirstname: (firstname) => {
        if (!firstname) {
            return { errorCode: -1, errorMessage: 'invalid firstname provided' }
        } else {
            return { successCode: 1, successMessage: 'firstname updated successfully' }
        }
    },
    checkLastname: (lastname) => {
        if (!lastname) {
            return { errorCode: -1, errorMessage: 'invalid lastname provided' }
        } else {
            return { successCode: 1, successMessage: 'lastname updated successfully' }
        }
    }
};
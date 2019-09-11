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
            console.log('passwords do not match');
            return {errorCode: -1, errorMessage: 'passwords do not match'};
        } else {
            if (!schema.validate(password, {list: false})) {
                console.log('invalid password provided: missing ' + schema.validate(password, {list: true}));
                return { errorCode: -1, errorMessage: 'invalid password provided: missing ' + schema.validate(password, {list: true})
                };
            } else {
                return {successCode: 1, successMessage: 'password updated successfully'}
            }
        }
    },
    checkEmail: async (email) => {
        let emailCheck = await User.findOne({email: email});
        if (emailCheck && emailCheck.email) {
            console.log('email already taken');
            return {errorCode: -1, errorMessage: 'email already taken'}
        } else if (emailCheck && emailCheck.error) {
            console.log(emailCheck.error);
            return {errorCode: -1, errorMessage: 'error: ' + emailCheck.error}
        } else {
            if (validator.validate(email) === true) {
                console.log('email check passed');
                return {successCode: 1, successMessage: 'email updated successfully'}
            } else {
                console.log('invalid email provided');
                return {errorCode: -1, errorMessage: 'invalid email provided'}
            }
        }
    },
    checkUsername: async (username) => {
        let usernameCheck = await User.findOne({username: username});
        if (usernameCheck && usernameCheck.username) {
            console.log('username already taken');
            return {errorCode: -1, errorMessage: 'username already taken'}
        } else if (usernameCheck && usernameCheck.error) {
            console.log(usernameCheck.error);
            return {errorCode: -1, errorMessage: 'error: ' + usernameCheck.error}
        } else {
            console.log('username check passed');
            return {successCode: 1, successMessage: 'username updated successfully'}
        }
    },
    checkFirstname: (firstname) => {
        if (!firstname) {
            console.log('invalid firstname provided');
            return {errorCode: -1, errorMessage: 'invalid firstname provided'}
        } else {
            console.log('firstname check passed');
            return {successCode: 1, successMessage: 'firstname updated successfully'}
        }
    },
    checkLastname: (lastname) => {
        if (!lastname) {
            console.log('invalid lastname provided');
            return {errorCode: -1, errorMessage: 'invalid lastname provided'}
        } else {
            console.log('lastname check passed');
            return {successCode: 1, successMessage: 'lastname updated successfully'}
        }
    }
};
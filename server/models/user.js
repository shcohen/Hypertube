const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;
const jwt = require('jwt-simple');
const config = require('../config/config');

let userSchema = mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: {createdAt: 'created_at'}});

userSchema.methods = {
    hashPassword: (password) => {
        return bcrypt.hash(password, saltRounds)
            .then(hashedPassword => {
                console.log(`password hashed: ${hashedPassword}`);
                return hashedPassword
            })
    },
    authenticate: (password, input) => {
        return bcrypt.compare(password, input, (error, result) => {
            if (error) throw error;
            return result !== false;
        });
    },
};

module.exports = mongoose.model('User', userSchema);
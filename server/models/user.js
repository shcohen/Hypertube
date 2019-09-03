const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    acc_id: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    validation: {
        type: Boolean,
        required: true
    },
    validationToken: {
        type: String,
        unique: true,
        required: true
    },
    resetToken: {
        type: String
    },
    lang: {
        type: String
    },
    googleId: {
        type: String
    },
    githubId: {
        type: String
    },
    fortyTwoId: {
        type: String
    },
    accessToken: {
        type: String
    },
    profilePic: {
        data: Buffer,
        contentType: String
    }
}, {timestamps: {createdAt: 'created_at'}});

// when the data is send from user.create the .pre will hash the pwd before creating user with schema
userSchema.pre('save', function (next) {
    const user = this; // this = data from sign-up form
    if (this.isModified('password') || this.isNew) { // check if the password from this is != from model
        bcrypt.genSalt(10, (error, salt) => {
            if (error) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, (error, hash) => {
                if (error) {
                    return next(error);
                }
                user.password = hash;
                next(); // done with pre --> goes to creating schema
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.authenticate = async (password, dbpassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, dbpassword, (error, res) => {
            if (error) reject(error);
            resolve(res);
        });
    })
};


module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let userSchema = new mongoose.Schema({
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

// when the data is send from user.create the .pre will hash the pwd before creating user with schema
userSchema.pre('save', function (next) {
    const user = this; // this = data from sign-up form
    if (this.isModified('password') || this.isNew) { // check if the password from this is != from model
        bcrypt.genSalt(10, (error, salt) => {
            if (error) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, null, (error, hash) => {
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

userSchema.methods.authenticate = (password, cb) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', userSchema);
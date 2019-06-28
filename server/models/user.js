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

userSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                console.log(hash);
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.authenticate = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// userSchema.methods.authenticate = (password, input) => {
// return bcrypt.compare(password, input, (error, result) => {
//      if (error) throw error;
//  return result !== false;
// });
// };

module.exports = mongoose.model('User', userSchema);
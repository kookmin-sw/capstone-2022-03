const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    joined_club: {
        type: [String]
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: String
    },
    address: {
        type: String
    }
})

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
    var user = this;
    // jsonwebtoken을 이용해서 토큰을 생성하기
    var token = jwt.sign(String(user._id), 'secretToken')

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}
const User = mongoose.model('User', userSchema)

module.exports = { User }
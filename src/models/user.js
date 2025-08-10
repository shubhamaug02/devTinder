const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Address " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Weak Password " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gender not valid");
            }
        }
    },
    imageUrl: {
        type: String,
        default: "https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL " + value)
            }
        }
    },
    about: {
        type: String,
        default: "About section of the user just added"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

userSchema.methods.getJWTToken = function () {
    // don't use arrow function, they does not have their own this 
    const user = this;
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    if (!token) {
        throw new Error("Invalid Token");
    }
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordMatched = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordMatched;
}

module.exports = mongoose.model('User', userSchema);


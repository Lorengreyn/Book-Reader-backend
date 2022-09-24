const {Schema, model} = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const {handleSchemaValidationErrors} = require("../helpers");

const emailRegexp = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;

const userSchema = new Schema({
    name: {
        type: String,
        minlength: 2,
        default: 'Guest',
      },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: emailRegexp,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    googleId: {
        type: String,
    },
    books: [
        {
          type: Schema.Types.ObjectId,
          ref: 'book',
        },
    ],
    training: {
        type: Schema.Types.ObjectId,
        ref: 'training',
        default: null,
    },
    token: {
        type: String,
        default: ""
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: true,
    }
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleSchemaValidationErrors);

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.string().required().valid(Joi.ref("password")),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const verifyEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
});

const schemas = {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
}

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}
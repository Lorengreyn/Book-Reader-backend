const {Schema, model} = require("mongoose");
const Joi = require("joi");

const {handleSchemaValidationErrors} = require("../helpers");

const bookStatus = {
    PLAN: 'plan',
    READ: 'read',
    DONE: 'done',
  };

const bookSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title must be exist"],
    },
    author: {
        type: String,
        required: [true, "Title must be exist"],
    },
    year: {
        type: Number,
        required: [true, 'Set year for book'],
    },
    totalPages: {
        type: Number,
        required: [true, 'Set total pages for book'],
    },
    readPages: {
        type: Number,
        default: 0,
        required: [true, 'Set read pages for book'],
    },
    rating: {
        type: Number,
        enum: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
        min: 0,
        max: 5,
        default: 0,
    },
    resume: {
        type: String,
        maxLength: 300,
    },
    status: {
        type: String,
        enum: {
            values: [bookStatus.PLAN, bookStatus.READ, bookStatus.DONE],
            message: "This subscription isn't allowed",
        },
        default: bookStatus.PLAN,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, {versionKey: false, timestamps: true});

bookSchema.post("save", handleSchemaValidationErrors)

const addSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    status: Joi.string().required(),
});


const schemas = {
    addSchema,
}

const Book = model("book", bookSchema);

module.exports = {
    Book,
    schemas,
}
const { Schema, model } = require('mongoose');
const Joi = require("joi");

const { handleSchemaValidationErrors } = require('../helpers');


const trainingSchema = new Schema(
  {
    startDate: {
      type: String,
      required: [true, 'Set start date for training'],
    },
    finishDate: {
      type: String,
      required: [true, 'Set end date for training'],
    },

    inProgress: {
      type: Boolean,
      default: true,
    },
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: 'book',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    result: {
      type: [
        {
          date: {
            type: String,
          },
          plannedPages: {
            type: Number,
            default: 0,
          },
          factPages: {
            type: Number,
            default: 0,
          },
          stats: [
            {
              time: {
                type: String,
              },
              pages: {
                type: Number,
                default: 0,
              },
            },
          ],
        },
      ],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

trainingSchema.post('save', handleSchemaValidationErrors);

const addSchema = Joi.object({
  startDate: Joi.string().required(),
  finishDate: Joi.string().required(),
  inProgress: Joi.bool(),
});

const schemas = {
  addSchema,
};

const Training = model('training', trainingSchema);

module.exports = {
  Training,
  schemas,
};
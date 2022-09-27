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
    date: {
      type: String,
    },
    plannedPages: {
      type: String,
      default: 0,
    },
    factPages: {
      type: Number,
      default: 0,
    },
    time: {
      type: String,
    },
    dateNow:{
      type: String,
    },
    pages: {
      type: Number,
      default: 0,
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

const statisticTrainingSchema = Joi.object({
  dateNow: Joi.string().required(),
  pages: Joi.number().required(),
  time: Joi.string(),
})

const schemasTraining = {
  addSchema,
  statisticTrainingSchema,
};

const Training = model('training', trainingSchema);

module.exports = {
  Training,
  schemasTraining,
};
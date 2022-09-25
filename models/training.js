const { Schema } = require('mongoose');

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
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
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

module.exports = trainingSchema;
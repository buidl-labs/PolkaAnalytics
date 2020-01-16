const mongoose = require('mongoose');

const Validator = new mongoose.Schema(
  {
    stashId: {
      type: String,
      maxlength: 255,
      required: true
    },
    stashIdTruncated: {
      type: String,
      maxlength: 100,
      required: true
    },
    points: {
      type: [Number],
      required: true
    },
    poolReward: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    totalStake: {
      type: Number,
      default: 0.01
    },
    commission: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 255
    },
    noOfNominators: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('validators', Validator);

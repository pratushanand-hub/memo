const mongoose = require('mongoose');

const mistakeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    severity: {
      type: String,
      default: 'Medium'
    },
    lesson: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Mistake = mongoose.model('Mistake', mistakeSchema);

module.exports = Mistake;
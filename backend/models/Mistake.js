const mongoose = require('mongoose');

const mistakeSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    context: {
      type: String,
      default: ''
    },
    cause: {
      type: String,
      default: ''
    },
    solution: {
      type: String,
      default: ''
    },
    lesson: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'General'
    },
    severity: {
      type: String,
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['solved', 'investigating', 'open'],
      default: 'investigating'
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

const Mistake = mongoose.models.Mistake || mongoose.model('Mistake', mistakeSchema);

module.exports = Mistake;
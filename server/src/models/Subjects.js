const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // fast lookup of "all subjects for this user"
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    // Optional: lets students customize source priority per subject (FR-06)
    sourcePriority: {
      type: Map,
      of: Number,
      default: {
        TEXTBOOK: 2,
        TEACHER_NOTES: 1,
        SENIOR_NOTES: 3,
        PERSONAL_NOTES: 4,
        OTHER: 5,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
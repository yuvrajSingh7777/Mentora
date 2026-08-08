const mongoose = require('mongoose');

const JOB_STATUS = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'DEAD_LETTER'];

const jobSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true, // e.g. 'DOCUMENT_PROCESSING'
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: JOB_STATUS,
      default: 'PENDING',
      index: true, // workers poll on this field
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    lastError: {
      type: String,
      default: null,
    },
    // Prevents two workers from grabbing the same job if you run
    // more than one worker process later
    lockedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
module.exports.JOB_STATUS = JOB_STATUS;
const mongoose = require('mongoose');

const SOURCE_TYPES = ['TEXTBOOK', 'TEACHER_NOTES', 'SENIOR_NOTES', 'PERSONAL_NOTES', 'OTHER'];

const STATUS_VALUES = [
  'UPLOADED',
  'QUEUED',
  'EXTRACTING',
  'CHUNKING',
  'EMBEDDING',
  'INDEXING',
  'COMPLETED',
  'FAILED',
];

const documentSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // needed for fast "does this user own this doc" checks
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String, // e.g. 'application/pdf'
      required: true,
    },
    fileSize: {
      type: Number, // bytes
      required: true,
    },
    filePath: {
      type: String, // the object key inside your R2/B2 bucket, e.g. 'uploads/user123/doc456.pdf'
      required: true,
    },
    storageProvider: {
      type: String,
      enum: ['r2', 'b2', 'local'],
      default: 'r2', // switch to 'b2' if you go with Backblaze instead
    },
    sourceType: {
      type: String,
      enum: SOURCE_TYPES,
      default: 'OTHER',
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: 'UPLOADED',
      index: true,
    },
    processingProgress: {
      type: Number, // 0-100
      default: 0,
    },
    totalChunks: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: null, // populated if status === 'FAILED'
    },
  },
  { timestamps: true }
);

// Compound index: most queries filter by subject AND user together
documentSchema.index({ subjectId: 1, userId: 1 });

module.exports = mongoose.model('Document', documentSchema);
module.exports.SOURCE_TYPES = SOURCE_TYPES;
module.exports.STATUS_VALUES = STATUS_VALUES;
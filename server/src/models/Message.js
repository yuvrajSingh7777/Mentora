const mongoose = require('mongoose');

// One source citation attached to an assistant message
const sourceSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    documentName: String,
    page: Number,
    chunkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chunk' },
    relevanceScore: Number,
  },
  { _id: false } // no need for a separate id on each source sub-document
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // Only populated on assistant messages
    sources: {
      type: [sourceSchema],
      default: [],
    },
    // Which learning mode produced this answer, if any (Explain/Detailed/Exam/etc.)
    mode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
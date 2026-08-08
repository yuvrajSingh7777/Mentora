const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true, // critical: retrieval always filters by subject first (FR-13)
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    // Vector embedding — dimension depends on your embedding model
    // (e.g. 1536 for OpenAI text-embedding-3-small, 768 for many open models)
    embedding: {
      type: [Number],
      required: true,
    },
    pageStart: {
      type: Number,
      default: null,
    },
    pageEnd: {
      type: Number,
      default: null,
    },
    sourceType: {
      type: String,
      required: true, // denormalized copy from Document, so retrieval scoring
                       // doesn't need a join back to the documents collection
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Compound index for the most common retrieval pre-filter:
// "find chunks in this subject, optionally scoped to this user"
chunkSchema.index({ subjectId: 1, userId: 1 });

module.exports = mongoose.model('Chunk', chunkSchema);

/*
IMPORTANT — Atlas Vector Search index (create this in the Atlas UI, not in code):

{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,        // match your embedding model's output size
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "subjectId"           // lets you pre-filter to one subject
    },
    {
      "type": "filter",
      "path": "userId"
    }
  ]
}

This lets you run $vectorSearch with a filter on subjectId + userId in the
same query — so you never accidentally retrieve another user's chunks.
*/
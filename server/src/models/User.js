const mongoose = require('mongoose');

const ROLES = ['student', 'admin'];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'student',
      index: true, // useful once you add admin-only routes/middleware
    },
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;

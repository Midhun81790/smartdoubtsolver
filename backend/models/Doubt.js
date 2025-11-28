const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 5,
      maxlength: 200
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: 10,
      maxlength: 2000
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    autoTags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    keywords: [{
      type: String,
      trim: true
    }],
    similarDoubts: [{
      doubt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doubt'
      },
      similarityScore: {
        type: Number,
        min: 0,
        max: 1
      }
    }],
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply'
    }],
    views: {
      type: Number,
      default: 0
    },
    upvotes: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['open', 'solved', 'closed'],
      default: 'open'
    },
    isFlagged: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for faster search
doubtSchema.index({ title: 'text', description: 'text' });
doubtSchema.index({ tags: 1 });
doubtSchema.index({ user: 1 });
doubtSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Doubt', doubtSchema);

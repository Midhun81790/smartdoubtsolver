const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    doubt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doubt',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Reply content is required'],
      trim: true,
      minlength: 5,
      maxlength: 1500
    },
    upvotes: {
      type: Number,
      default: 0
    },
    isAccepted: {
      type: Boolean,
      default: false
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

// Index for faster query
replySchema.index({ doubt: 1 });
replySchema.index({ user: 1 });

module.exports = mongoose.model('Reply', replySchema);

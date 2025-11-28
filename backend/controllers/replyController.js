const Reply = require('../models/Reply');
const Doubt = require('../models/Doubt');
const User = require('../models/User');

/**
 * Add reply to a doubt
 */
const addReply = async (req, res) => {
  try {
    const { doubtId } = req.params;
    const { content } = req.body;
    const userId = req.userId;
    
    // Validation
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }
    
    // Check if doubt exists
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }
    
    // Create reply
    const reply = new Reply({
      doubt: doubtId,
      user: userId,
      content
    });
    
    await reply.save();
    
    // Add reply to doubt
    doubt.replies.push(reply._id);
    await doubt.save();
    
    // Update user's reply count
    await User.findByIdAndUpdate(userId, { $inc: { repliesGiven: 1 } });
    
    // Populate reply with user info
    await reply.populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: { reply }
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reply',
      error: error.message
    });
  }
};

/**
 * Get all replies for a doubt
 */
const getRepliesByDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;
    
    const replies = await Reply.find({ doubt: doubtId })
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: { 
        replies,
        count: replies.length
      }
    });
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching replies',
      error: error.message
    });
  }
};

/**
 * Upvote a reply
 */
const upvoteReply = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reply = await Reply.findById(id);
    
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }
    
    reply.upvotes += 1;
    await reply.save();
    
    res.status(200).json({
      success: true,
      message: 'Reply upvoted',
      data: { reply }
    });
  } catch (error) {
    console.error('Upvote reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error upvoting reply',
      error: error.message
    });
  }
};

/**
 * Mark reply as accepted (by doubt owner)
 */
const acceptReply = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reply = await Reply.findById(id);
    
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }
    
    // Check if user is the doubt owner
    const doubt = await Doubt.findById(reply.doubt);
    if (doubt.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Only doubt owner can accept replies'
      });
    }
    
    reply.isAccepted = true;
    await reply.save();
    
    // Update doubt status to solved
    doubt.status = 'solved';
    await doubt.save();
    
    res.status(200).json({
      success: true,
      message: 'Reply accepted as solution',
      data: { reply }
    });
  } catch (error) {
    console.error('Accept reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting reply',
      error: error.message
    });
  }
};

/**
 * Delete reply
 */
const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reply = await Reply.findById(id);
    
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }
    
    // Check authorization
    if (reply.user.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this reply'
      });
    }
    
    // Remove reply from doubt
    await Doubt.findByIdAndUpdate(reply.doubt, {
      $pull: { replies: reply._id }
    });
    
    await Reply.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Reply deleted successfully'
    });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting reply',
      error: error.message
    });
  }
};

module.exports = {
  addReply,
  getRepliesByDoubt,
  upvoteReply,
  acceptReply,
  deleteReply
};

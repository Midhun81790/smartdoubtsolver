const Doubt = require('../models/Doubt');
const User = require('../models/User');
const { extractKeywords, cosineSimilarity } = require('../utils/nlpUtils');
const { predictTags } = require('../utils/tagPredictor');

/**
 * Create a new doubt with auto-tagging and similarity detection
 */
const createDoubt = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.userId;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    
    // Extract keywords
    const keywords = extractKeywords(`${title} ${description}`);
    
    // Predict tags automatically
    const autoTags = predictTags(title, description);
    
    // Combine user tags with auto tags
    const allTags = [...new Set([...(tags || []), ...autoTags])];
    
    // Create doubt
    const doubt = new Doubt({
      title,
      description,
      user: userId,
      tags: allTags,
      autoTags,
      keywords
    });
    
    // Find similar doubts
    const existingDoubts = await Doubt.find().select('title description _id');
    const similarDoubts = [];
    
    const currentText = `${title} ${description}`;
    
    for (const existingDoubt of existingDoubts) {
      const existingText = `${existingDoubt.title} ${existingDoubt.description}`;
      const similarity = cosineSimilarity(currentText, existingText);
      
      if (similarity > 0.3) { // Threshold for similarity
        similarDoubts.push({
          doubt: existingDoubt._id,
          similarityScore: similarity
        });
      }
    }
    
    // Sort by similarity score and take top 3
    doubt.similarDoubts = similarDoubts
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 3);
    
    await doubt.save();
    
    // Update user's doubt count
    await User.findByIdAndUpdate(userId, { $inc: { doubtsAsked: 1 } });
    
    // Populate doubt with user info
    await doubt.populate('user', 'name email');
    
    // Populate similar doubts
    await doubt.populate('similarDoubts.doubt', 'title views replies');
    
    res.status(201).json({
      success: true,
      message: 'Doubt posted successfully',
      data: {
        doubt,
        similarDoubtsFound: doubt.similarDoubts.length
      }
    });
  } catch (error) {
    console.error('Create doubt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating doubt',
      error: error.message
    });
  }
};

/**
 * Get all doubts with filters
 */
const getAllDoubts = async (req, res) => {
  try {
    const { 
      tags, 
      search, 
      status, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;
    
    // Build query
    const query = {};
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;
    
    // Get doubts
    const doubts = await Doubt.find(query)
      .populate('user', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Doubt.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        doubts,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get doubts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doubts',
      error: error.message
    });
  }
};

/**
 * Get single doubt by ID
 */
const getDoubtById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doubt = await Doubt.findById(id)
      .populate('user', 'name email role')
      .populate('replies')
      .populate('similarDoubts.doubt', 'title views replies tags');
    
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }
    
    // Increment views
    doubt.views += 1;
    await doubt.save();
    
    res.status(200).json({
      success: true,
      data: { doubt }
    });
  } catch (error) {
    console.error('Get doubt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doubt',
      error: error.message
    });
  }
};

/**
 * Get similar doubts for a specific doubt
 */
const getSimilarDoubts = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doubt = await Doubt.findById(id).populate('similarDoubts.doubt', 'title description tags views replies user');
    
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        similarDoubts: doubt.similarDoubts
      }
    });
  } catch (error) {
    console.error('Get similar doubts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching similar doubts',
      error: error.message
    });
  }
};

/**
 * Update doubt status
 */
const updateDoubtStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const doubt = await Doubt.findById(id);
    
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }
    
    // Check if user is the owner
    if (doubt.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this doubt'
      });
    }
    
    doubt.status = status;
    await doubt.save();
    
    res.status(200).json({
      success: true,
      message: 'Doubt status updated',
      data: { doubt }
    });
  } catch (error) {
    console.error('Update doubt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating doubt',
      error: error.message
    });
  }
};

/**
 * Delete doubt (admin or owner)
 */
const deleteDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doubt = await Doubt.findById(id);
    
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }
    
    // Check authorization
    if (doubt.user.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this doubt'
      });
    }
    
    await Doubt.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Doubt deleted successfully'
    });
  } catch (error) {
    console.error('Delete doubt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting doubt',
      error: error.message
    });
  }
};

/**
 * Get tag statistics
 */
const getTagStats = async (req, res) => {
  try {
    const stats = await Doubt.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    res.status(200).json({
      success: true,
      data: { tagStats: stats }
    });
  } catch (error) {
    console.error('Get tag stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tag statistics',
      error: error.message
    });
  }
};

module.exports = {
  createDoubt,
  getAllDoubts,
  getDoubtById,
  getSimilarDoubts,
  updateDoubtStatus,
  deleteDoubt,
  getTagStats
};

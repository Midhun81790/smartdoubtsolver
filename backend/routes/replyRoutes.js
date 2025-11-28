const express = require('express');
const router = express.Router();
const {
  addReply,
  getRepliesByDoubt,
  upvoteReply,
  acceptReply,
  deleteReply
} = require('../controllers/replyController');
const { auth } = require('../middleware/auth');

// Protected routes (all require authentication)
router.post('/:doubtId', auth, addReply);
router.get('/:doubtId', getRepliesByDoubt);
router.patch('/:id/upvote', auth, upvoteReply);
router.patch('/:id/accept', auth, acceptReply);
router.delete('/:id', auth, deleteReply);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createDoubt,
  getAllDoubts,
  getDoubtById,
  getSimilarDoubts,
  updateDoubtStatus,
  deleteDoubt,
  getTagStats
} = require('../controllers/doubtController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllDoubts);
router.get('/stats/tags', getTagStats);
router.get('/:id', getDoubtById);
router.get('/:id/similar', getSimilarDoubts);

// Protected routes
router.post('/', auth, createDoubt);
router.patch('/:id/status', auth, updateDoubtStatus);
router.delete('/:id', auth, deleteDoubt);

module.exports = router;

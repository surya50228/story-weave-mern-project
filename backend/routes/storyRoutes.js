const express = require('express');
const { getStories, createStory, getStoryById, addContribution } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getStories).post(protect, createStory);
router.route('/:id').get(getStoryById);
router.route('/:id/contribute').post(protect, addContribution);

module.exports = router;
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// @route   GET api/dashboard/stats
// @desc    Get creator statistics for dashboard
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get all posts authored by the user
    const posts = await Post.find({ author: req.user.id });
    
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const draftPosts = posts.filter(p => p.status === 'draft').length;

    // Get list of post IDs to find comments received on user's posts
    const postIds = posts.map(p => p._id);
    const totalComments = await Comment.countDocuments({ postId: { $in: postIds } });

    res.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

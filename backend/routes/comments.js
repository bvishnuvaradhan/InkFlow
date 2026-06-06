const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// @route   POST api/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/', auth, async (req, res) => {
  const { postId, content } = req.body;

  try {
    if (!postId || !content) {
      return res.status(400).json({ message: 'Post ID and content are required' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = new Comment({
      postId,
      userId: req.user.id,
      content
    });

    const comment = await newComment.save();
    
    // Populate user info
    await comment.populate('userId', 'name email avatar');

    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Verify user owns the comment
    if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

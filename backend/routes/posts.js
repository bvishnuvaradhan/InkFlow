const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// @route   GET api/posts
// @desc    Get all published posts (with filters & search & sorting)
// @access  Public (or Auth for dashboard)
router.get('/', async (req, res) => {
  try {
    const { search, category, tag, authorName, sortBy, authorOnly } = req.query;
    
    let query = {};

    // For public feed, only show published posts.
    // If authorOnly is requested, verify user token and filter by that user.
    if (authorOnly === 'true') {
      // We need auth header manually if checking authorOnly
      const authHeader = req.header('Authorization');
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization required for private dashboard posts' });
      }
      try {
        const token = authHeader.split(' ')[1];
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        query.author = decoded.id;
      } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      query.status = 'published';
    }

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by Tag
    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    // Search query (matches title or tags)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by Author Name
    if (authorName) {
      const users = await User.find({ name: { $regex: authorName, $options: 'i' } });
      const userIds = users.map(u => u._id);
      query.author = { $in: userIds };
    }

    let postsQuery = Post.find(query).populate('author', 'name email avatar role');

    // Mongoose sorting if sorting by date
    if (sortBy === 'createdAt') {
      postsQuery = postsQuery.sort({ createdAt: -1 });
    } else if (sortBy === 'oldest') {
      postsQuery = postsQuery.sort({ createdAt: 1 });
    } else {
      // Default standard db sorting
      postsQuery = postsQuery.sort({ createdAt: -1 });
    }

    let posts = await postsQuery;

    // In-memory sorting if sorting by Likes
    if (sortBy === 'likes') {
      posts.sort((a, b) => (b.likes || []).length - (a.likes || []).length);
    }

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID with comments
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.id || req.params.id).populate('author', 'name email avatar role');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Fetch comments for this post
    const comments = await Comment.find({ postId: post._id })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      post,
      comments
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, content, coverImage, tags, category, status } = req.body;

  try {
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    let processedTags = [];
    if (tags) {
      processedTags = Array.isArray(tags) 
        ? tags 
        : tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    const newPost = new Post({
      title,
      content,
      coverImage: coverImage || undefined,
      tags: processedTags,
      category,
      status: status || 'published',
      author: req.user.id
    });

    const post = await newPost.save();
    
    // Populate author info before returning
    await post.populate('author', 'name email avatar role');

    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, content, coverImage, tags, category, status } = req.body;

  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Make sure user is post author
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to edit this post' });
    }

    let processedTags = post.tags;
    if (tags !== undefined) {
      processedTags = Array.isArray(tags) 
        ? tags 
        : tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    post.title = title !== undefined ? title : post.title;
    post.content = content !== undefined ? content : post.content;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.tags = processedTags;
    post.category = category !== undefined ? category : post.category;
    post.status = status !== undefined ? status : post.status;

    await post.save();
    await post.populate('author', 'name email avatar role');

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Make sure user is post author
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to delete this post' });
    }

    // Delete post
    await Post.findByIdAndDelete(req.params.id);

    // Delete associated comments
    await Comment.deleteMany({ postId: req.params.id });

    res.json({ message: 'Post and associated comments removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/:id/like
// @desc    Like / unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      // Already liked, so unlike it
      post.likes.splice(likeIndex, 1);
    } else {
      // Not liked, so like it
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

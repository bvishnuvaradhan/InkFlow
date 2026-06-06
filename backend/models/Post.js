const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    enum: ['Technology', 'Programming', 'AI', 'Web Development', 'Career'],
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);

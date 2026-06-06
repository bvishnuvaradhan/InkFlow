const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.name || 'User')}`;
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mount
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to InkFlow API' });
});

// Port configuration
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inkflow';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully.');
  })
  .catch(err => {
    console.error('Database Connection Error: ', err.message);
  });

// Listen on port only if running locally (not on Vercel serverless)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

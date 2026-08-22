const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mistake_memo';

mongoose
  .connect(mongoURI)
  .then(() => console.log('🍃 MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));

// Route Mounts
app.use('/api/ai', require('./routes/aiRoutes'));

try {
  app.use('/api/mistakes', require('./routes/mistakeRoutes'));
} catch (e) {
  console.log('⚠️ Note on mistakeRoutes:', e.message);
}

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mistake-Memo Backend is healthy' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is live and listening on http://localhost:${PORT}`);
});
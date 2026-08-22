const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err.message));

// Routes
console.log('Loading AI routes...');
const aiRoutes = require('./routes/aiRoutes');

console.log('Loading mistake routes...');
const mistakeRoutes = require('./routes/mistakeRoutes');

app.use('/api/ai', aiRoutes);
app.use('/api/mistakes', mistakeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mistake Memo Backend is running',
    database: 'MongoDB'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is live and listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
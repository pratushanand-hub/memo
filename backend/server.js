const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
=======
const mongoose = require('mongoose');

>>>>>>> origin/tanishq
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Routes
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// Root route - Fetches and renders stored memories directly in the browser
app.get('/', async (req, res) => {
  try {
    const memcodeApiKey = process.env.MEMCODE_API_KEY;
    const response = await fetch('https://memory.memcode.in/v2/memory?limit=50', {
      headers: {
        'Authorization': `Bearer ${memcodeApiKey}`
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Dedicated memories endpoint
app.get('/api/memories', async (req, res) => {
  try {
    const memcodeApiKey = process.env.MEMCODE_API_KEY;
    const response = await fetch('https://memory.memcode.in/v2/memory?limit=50', {
      headers: {
        'Authorization': `Bearer ${memcodeApiKey}`
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Start persistent server
=======
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
>>>>>>> origin/tanishq
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is live and listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
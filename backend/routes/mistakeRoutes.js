console.log("mistakeRoutes.js loaded");
const express = require('express');
const router = express.Router();

const Mistake = require('../models/Mistake');

// 1. CREATE a mistake (Scoped to userEmail)
router.post('/', async (req, res) => {
  try {
    const { userEmail, title } = req.body;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'User email is required to record a mistake'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const mistake = await Mistake.create({
      ...req.body,
      userEmail: userEmail.toLowerCase()
    });

    res.status(201).json({
      success: true,
      message: 'Mistake saved successfully',
      data: mistake
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 2. GET all mistakes (Scoped by ?userEmail=...)
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      // If no user email provided, return empty list
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const mistakes = await Mistake.find({ 
      userEmail: userEmail.toLowerCase() 
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      data: mistakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. GET one mistake
router.get('/:id', async (req, res) => {
  try {
    const mistake = await Mistake.findById(req.params.id);

    if (!mistake) {
      return res.status(404).json({
        success: false,
        message: 'Mistake not found'
      });
    }

    res.json({
      success: true,
      data: mistake
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 4. UPDATE a mistake
router.put('/:id', async (req, res) => {
  try {
    const mistake = await Mistake.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: mistake
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 5. DELETE a mistake
router.delete('/:id', async (req, res) => {
  try {
    await Mistake.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Mistake deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
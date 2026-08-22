console.log("mistakeRoutes.js loaded");
const express = require('express');
const router = express.Router();

const Mistake = require('../models/Mistake');


// CREATE a mistake
router.post('/', async (req, res) => {
  try {
    const mistake = await Mistake.create(req.body);

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


// GET all mistakes
router.get('/', async (req, res) => {
  try {
    const mistakes = await Mistake.find().sort({
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


// GET one mistake
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


// UPDATE a mistake
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


// DELETE a mistake
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
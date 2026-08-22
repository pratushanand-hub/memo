const express = require('express');
const router = express.Router();
const { analyzeMistake } = require('../controllers/aiController');

router.post('/analyze', analyzeMistake);

module.exports = router;
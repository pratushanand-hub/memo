const express = require('express');
const router = express.Router();
const { analyzeMistake, askCoach } = require('../controllers/aiController');

router.post('/analyze', analyzeMistake);
router.post('/coach', askCoach);

module.exports = router;
const express = require('express');
const router = express.Router();
const { addCalorieLog, getCalorieLogs } = require('../controllers/calorieController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addCalorieLog)
  .get(protect, getCalorieLogs);

module.exports = router;
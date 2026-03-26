const express = require('express');
const router = express.Router();
const { addNutrition, getNutrition, clearNutrition } = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware'); // Use your existing auth mid

router.route('/')
  .get(protect, getNutrition)
  .post(protect, addNutrition)
  .delete(protect, clearNutrition);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts, deleteWorkout, 
  updateWorkout, toggleExercise } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

// 'protect' ensures only logged-in users can create workouts
router.route('/')
  .post(protect, createWorkout)
  .get(protect, getWorkouts); 


router.route('/:id')
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

router.put('/:workoutId/exercises/:exerciseId', protect, toggleExercise);

module.exports = router;
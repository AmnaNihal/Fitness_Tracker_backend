const Workout = require('../models/Workout');
const User = require('../models/User'); 


// @desc    Create a new workout
// @route   POST /api/workouts
const createWorkout = async (req, res) => {
  try {
    const { name, category, exercises, tags } = req.body;

    // 1. Create the Workout
    const workout = await Workout.create({
      user: req.user._id, 
      name,
      category,
      exercises, 
      tags
    });

    // 2. Add the Notification to the User (Fix variable name to 'name')
    await User.findByIdAndUpdate(req.user._id, {
      $push: { 
        notifications: { 
          $each: [{ 
            message: `New achievement: ${name} logged! 🏋️‍♂️`, 
            type: 'success',
            createdAt: new Date()
          }],
          $position: 0 // This puts it at the top of the list
        } 
      }
    });

    // 3. Send the response AFTER the notification is handled
    res.status(201).json(workout); 

  } catch (error) {
    console.error(error); // Add this to see errors in your terminal
    res.status(400).json({ message: 'Error creating workout' });
  }
};

// @route   GET /api/workouts
const getWorkouts = async (req, res) => {
    try {
      const workouts = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }; 

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
const deleteWorkout = async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (workout && workout.user.toString() === req.user._id.toString()) {
    await workout.deleteOne();
    res.json({ message: 'Workout removed' });
  } else {
    res.status(404).json({ message: 'Workout not found' });
  }
};


// Workout update

const updateWorkout = async (req, res) => {
  const { name, category, exercises, notes, tags } = req.body;
  const workout = await Workout.findById(req.params.id);

  if (workout && workout.user.toString() === req.user._id.toString()) {
    workout.name = name || workout.name;
    workout.category = category || workout.category;
    workout.exercises = exercises || workout.exercises;
    workout.notes = notes || workout.notes;
    // Fix: Assign tags to the workout object
    workout.tags = tags || workout.tags; 

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } else {
    res.status(404).json({ message: 'Workout not found' });
  }
}; 


// @desc    Toggle completion status of an exercise
// @route   PUT /api/workouts/:workoutId/exercises/:exerciseId
const toggleExercise = async (req, res) => {
  try {
    const { workoutId, exerciseId } = req.params;
    const { completed } = req.body;

    // Find the workout and update the specific exercise's completed status
    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, "exercises._id": exerciseId, user: req.user._id },
      { $set: { "exercises.$.completed": completed } },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout or Exercise not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = { createWorkout, getWorkouts, deleteWorkout, updateWorkout, toggleExercise };
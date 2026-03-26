const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: { type: String, required: true },
  category: { type: String, default: 'Strength' },
  exercises: [
    {
      exerciseName: String,
      sets: Number,
      reps: Number,
      weight: Number, 

      completed: { type: Boolean, default: false }
    }
  ],
  // Changed from tag to tags to match your req.body
  tags: [{ type: String }],
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
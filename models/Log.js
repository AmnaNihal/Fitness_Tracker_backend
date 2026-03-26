const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  workoutName: { type: String, required: true },
  category: { type: String },
  exercises: [
    {
      exerciseName: String,
      sets: Number,
      reps: Number,
      weight: Number,
    }
  ],
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
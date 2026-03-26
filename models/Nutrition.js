const mongoose = require('mongoose');

const nutritionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  foodName: { type: String, required: true },
  calories: { type: Number, required: true, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', nutritionSchema);
const Nutrition = require('../models/Nutrition');

// @desc    Add a nutrition log
// @route   POST /api/nutrition
const addNutrition = async (req, res) => {
  try {
    const { foodName, calories, protein, carbs, fats } = req.body;
    const log = await Nutrition.create({
      user: req.user._id,
      foodName,
      calories,
      protein,
      carbs,
      fats
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: 'Error saving nutrition log' });
  }
};

// Nutrition logs 
const getNutrition = async (req, res) => {
  try {
    const logs = await Nutrition.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Delete all nutrition logs for the logged-in user
// @route   DELETE /api/nutrition
const clearNutrition = async (req, res) => {
    try {
      // This deletes ONLY the logs belonging to the logged-in user
      await Nutrition.deleteMany({ user: req.user._id }); 
      res.status(200).json({ message: 'All logs cleared' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };


module.exports = { addNutrition, getNutrition, clearNutrition };
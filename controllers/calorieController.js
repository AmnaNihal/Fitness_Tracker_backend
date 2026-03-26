const Calorie = require('../models/Calorie');

// @desc    Add a calorie/meal log
// @route   POST /api/calories
const addCalorieLog = async (req, res) => {
  try {
    const { foodName, calories, protein, carbs, fats } = req.body;
    const log = await Calorie.create({
      user: req.user._id,
      foodName,
      calories,
      protein,
      carbs,
      fats
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: 'Error saving calorie log' });
  }
};

// @desc    Get all logs for the logged-in user
// @route   GET /api/calories
const getCalorieLogs = async (req, res) => {
  try {
    const logs = await Calorie.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { addCalorieLog, getCalorieLogs };
const Log = require('../models/Log');

const createLog = async (req, res) => {
  try {
    const { workoutName, category, exercises } = req.body;
    const log = await Log.create({
      user: req.user._id,
      workoutName,
      category,
      exercises
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: 'Error logging workout' });
  }
};

const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Delete all logs for the logged-in user
// @route   DELETE /api/logs
const clearLogs = async (req, res) => {
    try {
      await Log.deleteMany({ user: req.user._id });
      res.json({ message: 'History cleared successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };





module.exports = { createLog, getLogs, clearLogs }; 
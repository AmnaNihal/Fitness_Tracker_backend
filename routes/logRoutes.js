const express = require('express');
const router = express.Router();
const { createLog, getLogs,clearLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createLog).get(protect, getLogs) .delete(protect, clearLogs);

module.exports = router;
const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, addNotification, markNotificationsRead } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/notifications', protect, addNotification);
router.put('/notifications/read', protect, markNotificationsRead);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
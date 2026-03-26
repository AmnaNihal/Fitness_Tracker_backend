const User = require('../models/User');
const jwt = require('jsonwebtoken');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const cleanName = String(name).trim();
const cleanEmail = String(email).trim().toLowerCase();

if (!cleanName || !cleanEmail || !password) {
  return res.status(400).json({ message: 'All fields are required' });
}

if (cleanName.length < 3) {
  return res.status(400).json({ message: 'Name must be at least 3 characters' });
}

if (!nameRegex.test(cleanName)) {
  return res.status(400).json({ message: 'Name can only contain letters and spaces' });
}

if (!emailRegex.test(cleanEmail)) {
  return res.status(400).json({ message: 'Invalid email format' });
}

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message: 'Password must contain 1 uppercase, 1 lowercase and 1 number (min 8 chars)'
  });
}

  const userExists = await User.findOne({ email: cleanEmail });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name: cleanName, email: cleanEmail, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // ✅ Minimal backend validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const user = await User.findOne({ email: cleanEmail });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      weight: user.weight,
      height: user.height,
      dailyCalorieGoal: user.dailyCalorieGoal,
      notifications: user.notifications,
      settings: user.settings,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};


// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  // req.user was set by the protect middleware!
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email, 
      profilePicture: req.user.profilePicture,
      bio: req.user.bio,
      weight: req.user.weight,
      height: req.user.height,
      dailyCalorieGoal: req.user.dailyCalorieGoal, 
      diary: req.user.diary, 
      notifications: req.user.notifications, 
  settings: req.user.settings,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}; 





// @desc    Add a notification to user history
// @route   POST /api/auth/notifications
const addNotification = async (req, res) => {
  const { message, type } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    // Add the new notification to the beginning of the array (unshift) 
    // so the newest ones appear at the top
    user.notifications.unshift({
      message,
      type: type || 'info',
      createdAt: new Date(),
      read: false
    });

    // Keep only the last 20 notifications to prevent the document from getting too large
    if (user.notifications.length > 20) {
      user.notifications = user.notifications.slice(0, 20);
    }

    await user.save();
    res.status(201).json(user.notifications);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};




// @desc    Mark all notifications as read
// @route   PUT /api/auth/notifications/read
const markNotificationsRead = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.notifications.forEach(n => n.read = true);
    await user.save();
    res.json({ message: 'Notifications marked as read' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};




// @desc    Update user profile
// @route   PUT /api/users/profile
// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // 1. Standard Fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.bio = req.body.bio || user.bio; 
    user.weight = req.body.weight || user.weight;
    user.height = req.body.height || user.height;
    user.dailyCalorieGoal = req.body.dailyCalorieGoal || user.dailyCalorieGoal;
    user.diary = req.body.diary !== undefined ? req.body.diary : user.diary; 
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    // 2. Nested Settings (Crucial for Toggles and Time)
    if (req.body.settings && req.body.settings.reminders) {
      user.settings.reminders = {
        workout: {
          ...user.settings.reminders.workout,
          ...req.body.settings.reminders.workout
        },
        meal: {
          ...user.settings.reminders.meal,
          ...req.body.settings.reminders.meal
        }
      };
    }

    // 3. Save EVERYTHING at once
    const updatedUser = await user.save(); 

    // 4. Return the FULL object so the Frontend stays in sync
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      bio: updatedUser.bio,
      weight: updatedUser.weight,
      height: updatedUser.height,
      dailyCalorieGoal: updatedUser.dailyCalorieGoal,
      diary: updatedUser.diary,
      notifications: updatedUser.notifications, // Added
      settings: updatedUser.settings,           // Added
      token: req.headers.authorization.split(' ')[1], 
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, addNotification, markNotificationsRead }; 
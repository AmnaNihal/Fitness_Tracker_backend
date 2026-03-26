const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" }, // Requirement 44
    bio: { type: String, default: "" },  

// fields for stats and goals
weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    dailyCalorieGoal: { type: Number, default: 2500 },
    diary: { type: String, default: "" }, 

    // Notification History
    notifications: [
      {
        message: { type: String, required: true },
        type: { type: String, enum: ['success', 'info', 'alert'], default: 'info' },
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
      }
    ],

    // COMBINED SETTINGS: This handles both the toggle and the time
    settings: {
      reminders: {
        workout: { 
          enabled: { type: Boolean, default: true }, 
          time: { type: String, default: "08:00" } 
        },
        meal: { 
          enabled: { type: Boolean, default: true }, 
          time: { type: String, default: "12:00" } 
        }
      }
    }

  },
  { timestamps: true }
);

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving to database
userSchema.pre('save', async function () {
  // If the password hasn't been changed, just exit the function
  if (!this.isModified('password')) {
    return; 
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
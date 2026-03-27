const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const path = require('path'); 
const connectDB = require('./config/db');

// Route files
const workoutRoutes = require('./routes/workoutRoutes');
const calorieRoutes = require('./routes/calorieRoutes');
const logRoutes = require('./routes/logRoutes'); 
const nutritionRoutes = require('./routes/nutritionRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Middleware to read JSON data from requests
app.use(cors({
  origin: 'https://fitness-tracker-gamma-coral.vercel.app', 
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Fitness Tracker API is running...');
});

const PORT = process.env.PORT || 5000; 


const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes); 
app.use('/api/calories', calorieRoutes);
app.use('/api/logs', logRoutes); 
app.use('/api/nutrition', nutritionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

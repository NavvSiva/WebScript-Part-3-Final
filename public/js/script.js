const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Schemas and Models
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  distance: { type: Number },
  avgSpeed: { type: Number },
  avgHeartRate: { type: Number },
  calories: { type: Number },
});

const User = mongoose.model('User', userSchema);
const Workout = mongoose.model('Workout', workoutSchema);

// Routes
// Register a user
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Email and password are required.');

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).send('User already registered.');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });

  await user.save();
  res.status(201).send('User registered successfully.');
});

// Login a user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Email and password are required.');

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid email or password.');

  res.status(200).json({ userId: user._id });
});

// Add a workout
app.post('/workouts', async (req, res) => {
  const { userId, workout } = req.body;
  if (!userId || !workout) return res.status(400).send('User ID and workout data are required.');

  const newWorkout = new Workout({ ...workout, user: userId });
  await newWorkout.save();
  res.status(201).send('Workout logged successfully.');
});

// Get all workouts for a user
app.get('/workouts/:userId', async (req, res) => {
  const { userId } = req.params;

  const workouts = await Workout.find({ user: userId });
  res.status(200).json(workouts);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

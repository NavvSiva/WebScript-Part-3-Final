const express = require('express');
const Workout = require('../models/Workout');

const router = express.Router();

// Add a workout
router.post('/', async (req, res) => {
  const { userId, workout } = req.body;
  if (!userId || !workout) return res.status(400).send('User ID and workout data are required.');

  const newWorkout = new Workout({ ...workout, user: userId });
  await newWorkout.save();
  res.status(201).send('Workout logged successfully.');
});

// Get all workouts for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  const workouts = await Workout.find({ user: userId });
  res.status(200).json(workouts);
});

module.exports = router;

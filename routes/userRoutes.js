const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Register a user
router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Email and password are required.');

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid email or password.');

  res.status(200).json({ userId: user._id });
});

module.exports = router;

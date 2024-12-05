const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve static files from the public folder

// MongoDB connection
mongoose
  .connect('mongodb+srv://nav:nav@cluster0.6yqcz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Default route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html'); // Serve the homepage
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/html/register.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/html/login.html');
});

app.get('/workout_log', (req, res) => {
  res.sendFile(__dirname + '/public/html/workout_log.html');
});


// Routes
app.use('/users', userRoutes); // User-related routes (register, login)
app.use('/workouts', workoutRoutes); // Workout-related routes (add, get)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

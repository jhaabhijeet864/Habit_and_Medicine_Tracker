const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reminders', require('./routes/reminders'));

module.exports = app; // Export for Vercel
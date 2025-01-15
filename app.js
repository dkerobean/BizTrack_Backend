
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);

app.get('/api/test/', (req, res) => {
    res.json({message: 'Connection successful! API is working.'});
});

// API route


module.exports = app;


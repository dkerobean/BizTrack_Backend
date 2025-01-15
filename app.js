
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// CORS configuration (must come before routes)
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);


module.exports = app;


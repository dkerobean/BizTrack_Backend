
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/salesRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api", productRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/sale", saleRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


module.exports = app;


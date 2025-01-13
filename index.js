const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Use the port from the .env file
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

//Routes
const userRoutes = require("./routes/userRoutes");

app.use("/api/user", userRoutes);

// API route
app.get('/api', (req, res) => {
    res.send({ message: 'Hello, World!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

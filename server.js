
const app = require('./app');  // Import the app from app.js

// Use the port from the .env file or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


const app = require('./app');
const cors = require('cors');

// Enable CORS
app.use(cors());

// Use the port from the .env file or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

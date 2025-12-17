const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const scanRoutes = require('./routes/scanRoutes');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser for JSON format

// API Routes
app.use('/api', scanRoutes);

// --- Serve Frontend ---
// The '..' is because server.js is in backend/, and frontend/ is a sibling directory
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// For any route that is not an API route, send the index.html file
app.get('*', (req, res) => {
    // Check if the request is for an API route
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

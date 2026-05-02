const express = require('express');
const customLogger = require('./middleware/logger');

const app = express();
const PORT = 3000;

// 1. Parse JSON bodies (standard practice)
app.use(express.json());

// 2. Apply our custom logging middleware globally!
// Every request to any route will now pass through this algorithm.
app.use(customLogger);

// --- Sample Routes for Testing ---

// A simple fast route
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the custom logging API!" });
});

// A route that simulates a slow database call
app.get('/slow-route', (req, res) => {
    setTimeout(() => {
        res.status(200).json({ message: "This route took about 500ms to respond." });
    }, 500);
});

// A route that receives data
app.post('/data', (req, res) => {
    res.status(201).json({ 
        message: "Data received successfully",
        receivedData: req.body 
    });
});

// A route that throws an error (to test our colorized 500 output)
app.get('/error', (req, res) => {
    res.status(500).json({ error: "Internal Server Error! Something went wrong." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Check the console and 'server.log' for request logs.\n`);
});

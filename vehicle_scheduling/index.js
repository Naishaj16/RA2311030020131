const express = require('express');
const { getOptimizedSchedules } = require('./controllers/schedulerController');

const app = express();
const PORT = 4000;

// Parse incoming JSON
app.use(express.json());

/**
 * @route GET /api/schedule
 * @desc Fetches live data and runs DP optimization algorithm
 */
app.get('/api/schedule', getOptimizedSchedules);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: "Vehicle Scheduling API is running!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Scheduler API running on http://localhost:${PORT}`);
});

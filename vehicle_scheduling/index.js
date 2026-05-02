const express = require('express');
const { getOptimizedSchedules } = require('./controllers/schedulerController');

const app = express();
const PORT = 4000;


app.use(express.json());


app.get('/api/schedule', getOptimizedSchedules);


app.get('/', (req, res) => {
    res.json({ message: "Vehicle Scheduling API is running!" });
});


app.listen(PORT, () => {
    console.log(`🚀 Scheduler API running on http://localhost:${PORT}`);
});

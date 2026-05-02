const express = require('express');
const authMiddleware = require('./middleware/auth');
const logValidator = require('./middleware/validator');
const generateUUID = require('./utils/uuid');

const app = express();
const PORT = 3000;

// Parse incoming JSON
app.use(express.json());

/**
 * @route POST /api/logs
 * @desc Protected endpoint to ingest and validate application logs
 */
app.post('/api/logs', authMiddleware, logValidator, (req, res) => {
    // If the request makes it here, it has passed both:
    // 1. The Authentication check (Bearer token exists)
    // 2. The Strict Payload Validation check (Stack, Level, Package match exactly)

    // Generate a unique ID for this log entry
    const logID = generateUUID();

    // Respond exactly as the assignment specifies
    return res.status(200).json({
        logID: logID,
        message: "log created successfully"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Logging API running on http://localhost:${PORT}`);
});

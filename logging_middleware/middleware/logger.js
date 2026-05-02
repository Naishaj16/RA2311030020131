const fs = require('fs');
const path = require('path');

// Resolve the path for our log file
const logFilePath = path.join(__dirname, '..', 'server.log');

/**
 * Custom Logging Middleware
 * Captures Method, URL, Timestamp, Status Code, and exact Response Time.
 * Does not use any external libraries as per challenge requirements.
 */
const customLogger = (req, res, next) => {
    // 1. Capture the exact start time in milliseconds
    const startHrTime = process.hrtime();
    
    // 2. Generate a human-readable timestamp
    const now = new Date();
    const timestamp = now.toISOString();

    // 3. Hook into the 'finish' event of the response object
    // This event fires when Node has finished handing the response to the OS.
    res.on('finish', () => {
        // Calculate the elapsed time
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6).toFixed(3);

        const method = req.method;
        const url = req.originalUrl || req.url;
        const status = res.statusCode;

        // Construct the log string
        const logLine = `[${timestamp}] ${method} ${url} - Status: ${status} - Time: ${elapsedTimeInMs}ms\n`;

        // 4. Colorized Console Output (for a humanized, readable terminal experience)
        // Green for 2xx, Yellow for 3xx/4xx, Red for 5xx
        let colorCode = '\x1b[32m'; // Default green
        if (status >= 400 && status < 500) colorCode = '\x1b[33m'; // Yellow
        if (status >= 500) colorCode = '\x1b[31m'; // Red
        const resetCode = '\x1b[0m';

        console.log(`\x1b[36m[${timestamp}]\x1b[0m ${method} ${url} - ${colorCode}Status: ${status}${resetCode} - Time: ${elapsedTimeInMs}ms`);

        // 5. Append to a persistent log file (production-grade requirement)
        fs.appendFile(logFilePath, logLine, (err) => {
            if (err) {
                console.error("Failed to write to log file:", err);
            }
        });
    });

    // Pass control to the next middleware or route handler
    next();
};

module.exports = customLogger;

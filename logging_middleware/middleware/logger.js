const fs = require('fs');
const path = require('path');


const logFilePath = path.join(__dirname, '..', 'server.log');


const customLogger = (req, res, next) => {

    const startHrTime = process.hrtime();

    const now = new Date();
    const timestamp = now.toISOString();



    res.on('finish', () => {

        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6).toFixed(3);

        const method = req.method;
        const url = req.originalUrl || req.url;
        const status = res.statusCode;


        const logLine = `[${timestamp}] ${method} ${url} - Status: ${status} - Time: ${elapsedTimeInMs}ms\n`;



        let colorCode = '\x1b[32m';
        if (status >= 400 && status < 500) colorCode = '\x1b[33m';
        if (status >= 500) colorCode = '\x1b[31m';
        const resetCode = '\x1b[0m';

        console.log(`\x1b[36m[${timestamp}]\x1b[0m ${method} ${url} - ${colorCode}Status: ${status}${resetCode} - Time: ${elapsedTimeInMs}ms`);


        fs.appendFile(logFilePath, logLine, (err) => {
            if (err) {
                console.error("Failed to write to log file:", err);
            }
        });
    });


    next();
};

module.exports = customLogger;

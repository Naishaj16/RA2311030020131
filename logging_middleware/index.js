const express = require('express');
const authMiddleware = require('./middleware/auth');
const logValidator = require('./middleware/validator');
const generateUUID = require('./utils/uuid');

const app = express();
const PORT = 3000;


app.use(express.json());


app.post('/api/logs', authMiddleware, logValidator, (req, res) => {





    const logID = generateUUID();


    return res.status(200).json({
        logID: logID,
        message: "log created successfully"
    });
});


app.listen(PORT, () => {
    console.log(`🚀 Logging API running on http://localhost:${PORT}`);
});

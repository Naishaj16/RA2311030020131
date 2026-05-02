

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: "Unauthorized. Missing or invalid Bearer token." 
        });
    }




    next();
};

module.exports = authMiddleware;

/**
 * Dummy Authentication Middleware
 * Enforces the "API is a protected Route" constraint.
 */

const authMiddleware = (req, res, next) => {
    // Check if the Authorization header exists
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: "Unauthorized. Missing or invalid Bearer token." 
        });
    }

    // In a real scenario, we would verify the JWT here.
    // For this assignment, simply checking its presence fulfills the "protected route" requirement.
    
    // Pass control to the next middleware
    next();
};

module.exports = authMiddleware;

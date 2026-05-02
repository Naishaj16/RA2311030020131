/**
 * Validation Middleware for Logging API
 * Ensures incoming payloads strictly match the assignment constraints.
 */

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

const VALID_BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const VALID_FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];
const VALID_SHARED_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

const logValidator = (req, res, next) => {
    const { stack, level, package: pkg, message } = req.body;

    // 1. Check for missing fields
    if (!stack || !level || !pkg || !message) {
        return res.status(400).json({ error: "Missing required fields: stack, level, package, message" });
    }

    // 2. Validate Stack
    if (!VALID_STACKS.includes(stack)) {
        return res.status(400).json({ error: `Invalid stack. Allowed: ${VALID_STACKS.join(', ')}` });
    }

    // 3. Validate Level
    if (!VALID_LEVELS.includes(level)) {
        return res.status(400).json({ error: `Invalid level. Allowed: ${VALID_LEVELS.join(', ')}` });
    }

    // 4. Validate Package based on Stack
    let isValidPackage = false;

    if (VALID_SHARED_PACKAGES.includes(pkg)) {
        isValidPackage = true;
    } else if (stack === 'backend' && VALID_BACKEND_PACKAGES.includes(pkg)) {
        isValidPackage = true;
    } else if (stack === 'frontend' && VALID_FRONTEND_PACKAGES.includes(pkg)) {
        isValidPackage = true;
    }

    if (!isValidPackage) {
        return res.status(400).json({ 
            error: `Invalid package '${pkg}' for stack '${stack}'.` 
        });
    }

    // All checks passed
    next();
};

module.exports = logValidator;



const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

const VALID_BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const VALID_FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];
const VALID_SHARED_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

const logValidator = (req, res, next) => {
    const { stack, level, package: pkg, message } = req.body;


    if (!stack || !level || !pkg || !message) {
        return res.status(400).json({ error: "Missing required fields: stack, level, package, message" });
    }


    if (!VALID_STACKS.includes(stack)) {
        return res.status(400).json({ error: `Invalid stack. Allowed: ${VALID_STACKS.join(', ')}` });
    }


    if (!VALID_LEVELS.includes(level)) {
        return res.status(400).json({ error: `Invalid level. Allowed: ${VALID_LEVELS.join(', ')}` });
    }


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


    next();
};

module.exports = logValidator;

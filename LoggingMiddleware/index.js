const axios = require('axios');

// Valid values as per constraints
const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const VALID_FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];
const VALID_COMMON_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

/**
 * Reusable Log function that makes API call to the Test Server
 */
async function Log(stack, level, package, message) {
  try {
    // Validate input parameters
    if (!VALID_STACKS.includes(stack)) {
      console.error(`Invalid stack: ${stack}. Must be one of: ${VALID_STACKS.join(', ')}`);
      return;
    }

    if (!VALID_LEVELS.includes(level)) {
      console.error(`Invalid level: ${level}. Must be one of: ${VALID_LEVELS.join(', ')}`);
      return;
    }

    // Validate package based on stack
    let validPackages = [];
    if (stack === 'backend') {
      validPackages = [...VALID_BACKEND_PACKAGES, ...VALID_COMMON_PACKAGES];
    } else if (stack === 'frontend') {
      validPackages = [...VALID_FRONTEND_PACKAGES, ...VALID_COMMON_PACKAGES];
    }

    if (!validPackages.includes(package)) {
      console.error(`Invalid package for ${stack}: ${package}. Must be one of: ${validPackages.join(', ')}`);
      return;
    }

    if (!message || typeof message !== 'string') {
      console.error('Message must be a non-empty string');
      return;
    }

    // Prepare the log data
    const logData = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: package.toLowerCase(),
      message: message
    };

    // Make API call to the test server
    const response = await axios.post(LOG_API_URL, logData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`Log created successfully: ${response.data.message}`);

  } catch (error) {
    console.error('Failed to send log to server:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

/**
 * Express middleware for request logging
 */
function requestLoggerMiddleware(req, res, next) {
  const timestamp = new Date().toISOString();
  const logMessage = `${req.method} ${req.url}`;
  
  // Log the request (fire and forget, don't await)
  Log('backend', 'info', 'middleware', logMessage)
    .catch(err => console.error('Request logging failed:', err));
  
  next();
}

// Export both the Log function and the middleware
module.exports = {
  Log,
  requestLoggerMiddleware
};
// Import from the LoggingMiddleware package
const { Log } = require('../../LoggingMiddleware');

// Create a wrapper for backend logging
const logger = {
  debug: (package, message) => Log('backend', 'debug', package, message),
  info: (package, message) => Log('backend', 'info', package, message),
  warn: (package, message) => Log('backend', 'warn', package, message),
  error: (package, message) => Log('backend', 'error', package, message),
  fatal: (package, message) => Log('backend', 'fatal', package, message)
};

module.exports = logger;
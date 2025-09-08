
export const logger = {
  debug: (pkg, message) => console.log(`[DEBUG-${pkg}] ${message}`),
  info: (pkg, message) => console.log(`[INFO-${pkg}] ${message}`),
  warn: (pkg, message) => console.log(`[WARN-${pkg}] ${message}`),
  error: (pkg, message) => console.log(`[ERROR-${pkg}] ${message}`)
};
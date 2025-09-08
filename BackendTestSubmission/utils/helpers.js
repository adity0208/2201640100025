function generateRandomShortcode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function isAlphanumeric(str) {
  return /^[a-z0-9]+$/i.test(str);
}

function calculateExpiry(validityMinutes) {
  const now = new Date();
  return new Date(now.getTime() + validityMinutes * 60000);
}

module.exports = {
  generateRandomShortcode,
  isValidUrl,
  isAlphanumeric,
  calculateExpiry
};
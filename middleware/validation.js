const validator = require('validator');

const validateRegistration = (req, res, next) => {
  const { username, password, name, gender } = req.body;
  const errors = [];

  // Validate required fields
  if (!username || !password || !name || !gender) {
    errors.push('All fields are required');
  }

  // Validate username
  if (username && !validator.isAlphanumeric(username)) {
    errors.push('Username must contain only letters and numbers');
  }

  if (username && (username.length < 3 || username.length > 20)) {
    errors.push('Username must be between 3 and 20 characters');
  }

  // Validate password
  if (password && password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Validate name
  if (name && (name.length < 2 || name.length > 50)) {
    errors.push('Name must be between 2 and 50 characters');
  }

  // Validate gender
  if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase())) {
    errors.push('Gender must be male, female, or other');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username || !password) {
    errors.push('Username and password are required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateTweet = (req, res, next) => {
  const { tweet } = req.body;
  const errors = [];

  if (!tweet || !tweet.trim()) {
    errors.push('Tweet content is required');
  }

  if (tweet && tweet.length > 280) {
    errors.push('Tweet must be 280 characters or less');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateTweet,
};
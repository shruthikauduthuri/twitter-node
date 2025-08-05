const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');

class AuthController {
  async register(req, res) {
    try {
      const { username, password, name, gender } = req.body;
      const db = database.getDb();

      // Check if user already exists
      const existingUser = await db.get(
        'SELECT * FROM user WHERE username = ?',
        [username]
      );

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      await db.run(
        'INSERT INTO user (username, name, password, gender) VALUES (?, ?, ?, ?)',
        [username, name, hashedPassword, gender.toLowerCase()]
      );

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const db = database.getDb();

      // Find user
      const user = await db.get(
        'SELECT * FROM user WHERE username = ?',
        [username]
      );

      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { username: user.username, userId: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({ jwtToken: token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProfile(req, res) {
    try {
      const { username } = req;
      const db = database.getDb();

      const user = await db.get(
        'SELECT user_id, username, name, gender FROM user WHERE username = ?',
        [username]
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { User } = require('../models'); // Import the User model
const validator = require('validator');

// Placeholder for user-related routes
router.post('/register', async (req, res) => {
  const { email, phone, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Optional phone validation if provided
  if (phone && !validator.isMobilePhone(phone)) {
     // Note: validator.isMobilePhone requires a locale, or set strictMode to false
     // For simplicity, we'll just check if it's a string for now, or add a basic regex check
     // A more robust implementation would specify locales or use a dedicated phone validation library
     // For now, let's just ensure it's a string if present.
     if (typeof phone !== 'string') {
        return res.status(400).json({ message: 'Invalid phone number format.' });
     }
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with that email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      email,
      phone,
      password: hashedPassword,
      // isVerified defaults to false
    });

    // Respond with success (excluding password)
    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });

  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const payload = { id: user.id }; // Use 'id' instead of 'userId' for compatibility with auth middleware
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Use JWT_SECRET from .env

    // Respond with token and user info (excluding password)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

module.exports = router;

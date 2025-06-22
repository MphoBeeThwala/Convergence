const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { authenticateJWT } = require('../middleware/authMiddleware');

// JWT Secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Rate limiter for login endpoint
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { message: 'Too many login attempts, please try again later.' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    trustProxy: true // Trust X-Forwarded-For header
});

// Helper: Password strength validation
function isStrongPassword(password) {
    // At least 8 chars, one uppercase, one number
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// Helper to get db instance
function getDb(req) {
  return req.app.locals.db;
}

//User registration route 
router.post('/register', async (req, res) => {
    const db = getDb(req);
    const users = db.get('users').value();
    const {name, email, phone, nationalID, password, role} = req.body;
    // Basic Validation
    if (!name || !email || !phone || !nationalID || !password) {
        return res.status(400).json({ message: 'All fields are required'});
    }
    // Email format validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    // Password strength validation
    if (!isStrongPassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters, include an uppercase letter and a number.' });
    }
    // Prevent duplicate registration
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ message: 'Email already registered' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Default role to 'user' if not provided
    const userRole = role && ['admin', 'user'].includes(role) ? role : 'user';
    const newUser = new User(users.length + 1, name, email, phone, nationalID, hashedPassword, userRole);
    db.get('users').push(newUser).write();
    // Hide password in response
    const { password: pw, ...userWithoutPassword } = newUser;
    res.status(201).json({message: 'User registered succesfully!', user: userWithoutPassword});
});

//User login route
router.post('/login', loginLimiter, async (req, res) => {
    const db = getDb(req);
    const users = db.get('users').value();
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({message: 'invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({message: 'invalid email or password' });
    }
    // Issue JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    // Hide password in response
    const { password: pw, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful!', user: userWithoutPassword, token });
});

// Update account endpoint (protected)
router.put('/update', authenticateJWT, async (req, res) => {
    const db = getDb(req);
    const users = db.get('users').value();
    const { name, phone, password } = req.body;
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) {
        if (!isStrongPassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters, include an uppercase letter and a number.' });
        }
        user.password = await bcrypt.hash(password, 10);
    }
    db.set('users', users).write();
    const { password: pw, ...userWithoutPassword } = user;
    res.json({ message: 'Account updated', user: userWithoutPassword });
});

// Delete account endpoint (protected)
router.delete('/delete', authenticateJWT, async (req, res) => {
    const db = getDb(req);
    let users = db.get('users').value();
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
    users.splice(userIndex, 1);
    db.set('users', users).write();
    res.json({ message: 'Account deleted' });
});

module.exports = router;
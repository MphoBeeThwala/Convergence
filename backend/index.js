// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Trust proxy - required for Render.com deployment
app.set('trust proxy', 1);

// Body parser middleware
app.use(express.json());
app.use(cors());

// Import Routes
const shopRoutes = require('./routes/shopRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware to use routes
app.use('/api/shop', shopRoutes);
app.use('/api/auth', authRoutes);

// Use a free, file-based database (lowdb)
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { join } = require('path');

// Use lowdb for persistent user storage
const dbFile = join(__dirname, 'db.json');
const adapter = new FileSync(dbFile);
const db = low(adapter);

// Initialize DB with users and products if not present
db.defaults({ users: [], products: [] }).write();
app.locals.db = db;

// Health check route for readiness and integration testing
app.get('/', (req, res) => {
  res.json({ 
    status: 'Unified E-Commerce backend is running.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server only after DB is ready
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});

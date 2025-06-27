require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('../models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Placeholder for new API routes
const userRoutes = require('./routes/userRoutes');
const shoppingListRoutes = require('./routes/shoppingListRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/shopping-lists', shoppingListRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'Convergence Backend is running.',
    timestamp: new Date().toISOString(),
  });
});

// Export the app for testing
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database connected successfully.`);
    });
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
}
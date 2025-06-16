//Import Express const express = require('express');

//Create an Express app const app =express();

//Define a simple route app.get('/', req, res) => {res.send('Hello, Unified E-Commerce!');});

//Set the port (default to 3000) const PORT = process.env.PORT || 3000;

//Start the server app.listen(PORT , ()=> {console.log('Server is running on });

const express = require('express');
const cors = require('cors');
const app = express();

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
const FileSync = require('lowdb/lib/FileSync');
const { join } = require('path');

// Use lowdb for persistent user storage
const dbFile = join(__dirname, '../backend/db.json');
const adapter = new FileSync(dbFile);
const db = low(adapter);

// Initialize DB with users if not present
db.defaults({ users: [] }).write();
app.locals.db = db;

// Health check route for readiness and integration testing
app.get('/', (req, res) => {
  res.json({ status: 'Unified E-Commerce backend is running.' });
});

// CORS is already enabled for all origins. For production, restrict as needed:
// app.use(cors({ origin: 'http://localhost:3001' })); // Example for React dev server

// Start server only after DB is ready
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

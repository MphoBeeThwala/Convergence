const express = require('express');
const router = express.Router();
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { Product } = require(path.join(__dirname, '../models/Product'));
const { authenticateJWT } = require('../middleware/authMiddleware');
const dbFile = path.join(__dirname, '../db.json');
const adapter = new FileSync(dbFile);
const db = low(adapter);

// Ensure products array exists
if (!db.has('products').value()) db.set('products', []).write();

// List all products
router.get('/', (req, res) => {
  const products = db.get('products').value();
  res.json(products);
});

// Get product by id
router.get('/:id', (req, res) => {
  const product = db.get('products').find({ id: req.params.id }).value();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Add product (auth required)
router.post('/', authenticateJWT, (req, res) => {
  const { name, description, price, image } = req.body;
  if (!name || !description || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const id = Date.now().toString();
  const owner = req.user.email;
  const product = new Product(id, name, description, price, image, owner);
  db.get('products').push(product).write();
  res.status(201).json(product);
});

// Update product (auth, owner or admin)
router.put('/:id', authenticateJWT, (req, res) => {
  const product = db.get('products').find({ id: req.params.id }).value();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.owner !== req.user.email && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const { name, description, price, image } = req.body;
  db.get('products').find({ id: req.params.id }).assign({ name, description, price, image }).write();
  res.json(db.get('products').find({ id: req.params.id }).value());
});

// Delete product (auth, owner or admin)
router.delete('/:id', authenticateJWT, (req, res) => {
  const product = db.get('products').find({ id: req.params.id }).value();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.owner !== req.user.email && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  db.get('products').remove({ id: req.params.id }).write();
  res.json({ message: 'Product deleted' });
});

module.exports = router;

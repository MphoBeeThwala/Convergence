const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Add a new product
router.post('/', authMiddleware, async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Product name is required.' });
  }

  try {
    const newProduct = await Product.create({ name, description });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'An error occurred while creating the product.' });
  }
});

// Get all products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'An error occurred while fetching the products.' });
  }
});

// Delete a product
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'An error occurred while deleting the product.' });
  }
});

module.exports = router;

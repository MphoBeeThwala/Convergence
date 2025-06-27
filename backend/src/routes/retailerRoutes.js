const express = require('express');
const router = express.Router();
const { Retailer } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Add a new retailer
router.post('/', authMiddleware, async (req, res) => {
  const { name, location } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Retailer name is required.' });
  }

  try {
    const newRetailer = await Retailer.create({ name, location });
    res.status(201).json(newRetailer);
  } catch (error) {
    console.error('Error creating retailer:', error);
    res.status(500).json({ message: 'An error occurred while creating the retailer.' });
  }
});

// Get all retailers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const retailers = await Retailer.findAll();
    res.status(200).json(retailers);
  } catch (error) {
    console.error('Error fetching retailers:', error);
    res.status(500).json({ message: 'An error occurred while fetching the retailers.' });
  }
});

// Delete a retailer
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const retailer = await Retailer.findByPk(id);

    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found.' });
    }

    await retailer.destroy();
    res.status(200).json({ message: 'Retailer deleted successfully.' });
  } catch (error) {
    console.error('Error deleting retailer:', error);
    res.status(500).json({ message: 'An error occurred while deleting the retailer.' });
  }
});

module.exports = router;

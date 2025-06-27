const express = require('express');
const router = express.Router();
const { ShoppingList, ShoppingListItem } = require('../models'); // Import the ShoppingList and ShoppingListItem models
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware

// Create a new shopping list
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body; // Get name from body (userId is no longer needed)

  // Basic validation
  if (!name) {
    return res.status(400).json({ message: 'Shopping list name is required.' });
  }

  try {
    // Create new shopping list
    const newShoppingList = await ShoppingList.create({
      name,
      userId: req.user.id, // Use user ID from authentication middleware
    });

    // Respond with the created shopping list
    res.status(201).json(newShoppingList);
  } catch (error) {
    console.error('Error creating shopping list:', error);
    res.status(500).json({ message: 'An error occurred while creating the shopping list.' });
  }
});

// Get all shopping lists for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find shopping lists for the authenticated user
    const shoppingLists = await ShoppingList.findAll({
      where: { userId: req.user.id },
    });

    // Respond with the user's shopping lists
    res.status(200).json(shoppingLists);
  } catch (error) {
    console.error('Error fetching shopping lists:', error);
    res.status(500).json({ message: 'An error occurred while fetching the shopping lists.' });
  }
});

// Delete a shopping list
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findOne({
      where: { id, userId: req.user.id },
    });

    if (!shoppingList) {
      // Shopping list not found or doesn't belong to the user
      return res.status(404).json({ message: 'Shopping list not found.' });
    }

    // Delete the shopping list
    await shoppingList.destroy();

    // Respond with a success message
    res.status(200).json({ message: 'Shopping list deleted successfully.' });
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    res.status(500).json({ message: 'An error occurred while deleting the shopping list.' });
  }
});

// Add an item to a shopping list
router.post('/:id/items', authMiddleware, async (req, res) => {
  const { id } = req.params; // Shopping list ID
  const { name, quantity, productId } = req.body; // Item details

  // Basic validation
  if (!name || !quantity || !productId) {
    return res.status(400).json({ message: 'Item name, quantity, and productId are required.' });
  }

  try {
    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findOne({
      where: { id, userId: req.user.id },
    });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found.' });
    }

    // Add the item to the shopping list
    const newItem = await ShoppingListItem.create({
      name,
      quantity,
      productId,
      shoppingListId: id,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item to shopping list:', error);
    res.status(500).json({ message: 'An error occurred while adding the item.' });
  }
});

// View items in a shopping list
router.get('/:id/items', authMiddleware, async (req, res) => {
  const { id } = req.params; // Shopping list ID

  try {
    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findOne({
      where: { id, userId: req.user.id },
    });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found.' });
    }

    // Get items in the shopping list
    const items = await ShoppingListItem.findAll({
      where: { shoppingListId: id },
    });

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items from shopping list:', error);
    res.status(500).json({ message: 'An error occurred while fetching the items.' });
  }
});

// Delete an item from a shopping list
router.delete('/:id/items/:itemId', authMiddleware, async (req, res) => {
  const { id, itemId } = req.params; // Shopping list ID and item ID

  try {
    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findOne({
      where: { id, userId: req.user.id },
    });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found.' });
    }

    // Find the item by ID
    const item = await ShoppingListItem.findOne({
      where: { id: itemId, shoppingListId: id },
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    // Delete the item
    await item.destroy();

    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting item from shopping list:', error);
    res.status(500).json({ message: 'An error occurred while deleting the item.' });
  }
});

module.exports = router;

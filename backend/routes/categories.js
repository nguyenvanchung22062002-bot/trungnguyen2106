const express = require('express');
const { body } = require('express-validator');
const { adminAuth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category (Admin only)
router.post('/', adminAuth, [
  body('name').notEmpty().trim().escape(),
  body('description').optional().trim().escape()
], async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const [result] = await db.execute(
      'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)',
      [name, description, image]
    );

    const [category] = await db.execute('SELECT * FROM categories WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Category created successfully',
      category: category[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, image } = req.body;

    await db.execute(
      'UPDATE categories SET name = ?, description = ?, image = ? WHERE id = ?',
      [name, description, image, categoryId]
    );

    const [category] = await db.execute('SELECT * FROM categories WHERE id = ?', [categoryId]);

    if (category.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Category updated successfully',
      category: category[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category has products
    const [products] = await db.execute('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [categoryId]);
    
    if (products[0].count > 0) {
      return res.status(400).json({ message: 'Cannot delete category with existing products' });
    }

    await db.execute('DELETE FROM categories WHERE id = ?', [categoryId]);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
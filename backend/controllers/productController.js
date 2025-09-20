// backend/controllers/productController.js
const db = require('../config/database');
const { validationResult } = require('express-validator');

// Get all products with pagination and filters
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const category = req.query.category;
    const search = req.query.search;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const ageRange = req.query.ageRange;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';

    let whereClause = 'WHERE p.status = "active"';
    let queryParams = [];

    // Add filters
    if (category) {
      whereClause += ' AND p.category_id = ?';
      queryParams.push(category);
    }

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      whereClause += ' AND p.price >= ?';
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      whereClause += ' AND p.price <= ?';
      queryParams.push(maxPrice);
    }

    if (ageRange) {
      whereClause += ' AND p.age_range = ?';
      queryParams.push(ageRange);
    }

    // Get products with category info
    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]);

    // Get total count for pagination
    const [countResult] = await db.execute(`
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `, queryParams);

    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);

    // Parse images JSON
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.status = 'active'
    `, [productId]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    product.images = product.images ? JSON.parse(product.images) : [];

    res.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product (Admin only)
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      price,
      discount_price,
      category_id,
      stock_quantity,
      age_range
    } = req.body;

    // Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    }

    // Create product
    const [result] = await db.execute(`
      INSERT INTO products (name, description, price, discount_price, category_id, stock_quantity, age_range, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, description, price, discount_price || null, category_id, stock_quantity, age_range, JSON.stringify(images)]);

    // Get created product with category info
    const [createdProduct] = await db.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [result.insertId]);

    const product = createdProduct[0];
    product.images = JSON.parse(product.images);

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      description,
      price,
      discount_price,
      category_id,
      stock_quantity,
      age_range,
      status
    } = req.body;

    // Check if product exists
    const [existingProduct] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle new images
    let images = JSON.parse(existingProduct[0].images) || [];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      images = [...images, ...newImages];
    }

    // Update product
    await db.execute(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, discount_price = ?, 
          category_id = ?, stock_quantity = ?, age_range = ?, 
          images = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, price, discount_price || null, category_id, 
        stock_quantity, age_range, JSON.stringify(images), status || 'active', productId]);

    // Get updated product
    const [updatedProduct] = await db.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [productId]);

    const product = updatedProduct[0];
    product.images = JSON.parse(product.images);

    res.json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const [existingProduct] = await db.execute('SELECT id FROM products WHERE id = ?', [productId]);
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete - set status to inactive
    await db.execute('UPDATE products SET status = "inactive", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [productId]);

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active' AND p.discount_price IS NOT NULL
      ORDER BY (p.price - p.discount_price) DESC
      LIMIT ?
    `, [limit]);

    // Parse images JSON
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));

    res.json({ products: formattedProducts });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.status = 'active'
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [categoryId, limit, offset]);

    // Get total count
    const [countResult] = await db.execute(`
      SELECT COUNT(*) as total
      FROM products p
      WHERE p.category_id = ? AND p.status = 'active'
    `, [categoryId]);

    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);

    // Parse images JSON
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory
};
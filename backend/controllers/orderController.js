// backend/controllers/orderController.js
const db = require('../config/database');
const { validationResult } = require('express-validator');

// Create new order
const createOrder = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { items, shipping_address, payment_method, total_amount } = req.body;

    // Start transaction
    await connection.beginTransaction();

    // Validate items and calculate total
    let calculatedTotal = 0;
    for (const item of items) {
      const [products] = await connection.execute(
        'SELECT id, price, discount_price, stock_quantity FROM products WHERE id = ? AND status = "active"',
        [item.product_id]
      );

      if (products.length === 0) {
        await connection.rollback();
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }

      const product = products[0];
      
      // Check stock
      if (product.stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for product ${item.product_id}. Available: ${product.stock_quantity}` 
        });
      }

      // Calculate price (use discount_price if available)
      const price = product.discount_price || product.price;
      calculatedTotal += price * item.quantity;
    }

    // Verify total amount
    if (Math.abs(calculatedTotal - total_amount) > 0.01) {
      await connection.rollback();
      return res.status(400).json({ message: 'Total amount mismatch' });
    }

    // Create order
    const [orderResult] = await connection.execute(`
      INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, status, payment_status)
      VALUES (?, ?, ?, ?, 'pending', 'pending')
    `, [userId, total_amount, shipping_address, payment_method]);

    const orderId = orderResult.insertId;

    // Create order items and update stock
    for (const item of items) {
      const [products] = await connection.execute(
        'SELECT price, discount_price FROM products WHERE id = ?',
        [item.product_id]
      );
      
      const product = products[0];
      const price = product.discount_price || product.price;

      // Insert order item
      await connection.execute(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.product_id, item.quantity, price]);

      // Update stock
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Commit transaction
    await connection.commit();

    // Get created order with items
    const [orderData] = await connection.execute(`
      SELECT o.*, u.full_name, u.email, u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderId]);

    const [orderItems] = await connection.execute(`
      SELECT oi.*, p.name as product_name, p.images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    const order = {
      ...orderData[0],
      items: orderItems.map(item => ({
        ...item,
        images: item.images ? JSON.parse(item.images) : []
      }))
    };

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get orders
    const [orders] = await db.execute(`
      SELECT * FROM orders 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.execute(`
          SELECT oi.*, p.name as product_name, p.images
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [order.id]);

        return {
          ...order,
          items: items.map(item => ({
            ...item,
            images: item.images ? JSON.parse(item.images) : []
          }))
        };
      })
    );

    // Get total count
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [userId]
    );

    const totalOrders = countResult[0].total;
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders: ordersWithItems,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let whereClause = 'WHERE o.id = ?';
    let queryParams = [orderId];

    // Non-admin users can only see their own orders
    if (!isAdmin) {
      whereClause += ' AND o.user_id = ?';
      queryParams.push(userId);
    }

    const [orders] = await db.execute(`
      SELECT o.*, u.full_name, u.email, u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ${whereClause}
    `, queryParams);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get order items
    const [items] = await db.execute(`
      SELECT oi.*, p.name as product_name, p.images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    const order = {
      ...orders[0],
      items: items.map(item => ({
        ...item,
        images: item.images ? JSON.parse(item.images) : []
      }))
    };

    res.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, payment_status } = req.body;

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    if (payment_status && !validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    // Check if order exists
    const [existingOrder] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (existingOrder.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order
    let updateFields = [];
    let updateValues = [];

    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (payment_status) {
      updateFields.push('payment_status = ?');
      updateValues.push(payment_status);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(orderId);

    await db.execute(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated order
    const [updatedOrder] = await db.execute(`
      SELECT o.*, u.full_name, u.email, u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderId]);

    res.json({
      message: 'Order updated successfully',
      order: updatedOrder[0]
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let whereClause = '';
    let queryParams = [];

    if (status) {
      whereClause = 'WHERE o.status = ?';
      queryParams.push(status);
    }

    // Get orders with user info
    const [orders] = await db.execute(`
      SELECT o.*, u.full_name, u.email, u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]);

    // Get total count
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      queryParams
    );

    const totalOrders = countResult[0].total;
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    await connection.beginTransaction();

    // Get order
    let whereClause = 'WHERE id = ?';
    let queryParams = [orderId];

    if (!isAdmin) {
      whereClause += ' AND user_id = ?';
      queryParams.push(userId);
    }

    const [orders] = await connection.execute(
      `SELECT * FROM orders ${whereClause}`,
      queryParams
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      await connection.rollback();
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // Get order items to restore stock
    const [items] = await connection.execute(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
      [orderId]
    );

    // Restore stock for each item
    for (const item of items) {
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    await connection.execute(
      'UPDATE orders SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [orderId]
    );

    await connection.commit();

    res.json({ message: 'Order cancelled successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
};
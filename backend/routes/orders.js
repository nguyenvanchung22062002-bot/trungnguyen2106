// backend/routes/orders.js
const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
} = require('../controllers/orderController');

const router = express.Router();

// Validation rules
const orderValidation = [
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isInt(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('shipping_address').notEmpty().trim(),
  body('payment_method').notEmpty().trim(),
  body('total_amount').isFloat({ min: 0 })
];

// Routes
router.post('/', auth, orderValidation, createOrder);
router.get('/', auth, getUserOrders);
router.get('/admin/all', adminAuth, getAllOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/status', adminAuth, updateOrderStatus);
router.put('/:id/cancel', auth, cancelOrder);

module.exports = router;
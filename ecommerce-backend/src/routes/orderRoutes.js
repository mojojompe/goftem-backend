// src/routes/orderRoutes.js

const express = require('express');
const { createOrder, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/adminMiddleware');

const router = express.Router();

// Route to create a new order
router.post('/', authMiddleware, createOrder);

// Route to get an order by ID
router.get('/:orderId', authMiddleware, getOrderById);

// Route to get all orders (admin only)
router.get('/', adminMiddleware, getAllOrders);

// Route to update the status of an order (admin only)
router.put('/:orderId/status', adminMiddleware, updateOrderStatus);

module.exports = router;
// src/routes/cartRoutes.js

const express = require('express');
const { addToCart, removeFromCart, viewCart } = require('../controllers/cartController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to add an item to the cart
router.post('/add', authenticate, addToCart);

// Route to remove an item from the cart
router.delete('/remove/:productId', authenticate, removeFromCart);

// Route to view the cart
router.get('/', authenticate, viewCart);

module.exports = router;
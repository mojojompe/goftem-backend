const express = require('express');
const { 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getAllProducts, 
    getProductById, 
    getAllUsers, 
    getUserById, 
    deleteUser, 
    trackOrder 
} = require('../controllers/adminController');
const { adminMiddleware } = require('../middlewares/adminMiddleware');

const router = express.Router();

// Admin routes for product management
router.post('/products', adminMiddleware, addProduct); // Add a new product
router.put('/products/:id', adminMiddleware, updateProduct); // Update an existing product
router.delete('/products/:id', adminMiddleware, deleteProduct); // Delete a product
router.get('/products', adminMiddleware, getAllProducts); // Get all products
router.get('/products/:id', adminMiddleware, getProductById); // Get product details by ID

// Admin routes for user management
router.get('/users', adminMiddleware, getAllUsers); // Get all users
router.get('/users/:id', adminMiddleware, getUserById); // Get user details by ID
router.delete('/users/:id', adminMiddleware, deleteUser); // Delete a user

// Admin route for order tracking
router.get('/orders/:id', adminMiddleware, trackOrder); // Track order by ID

module.exports = router;
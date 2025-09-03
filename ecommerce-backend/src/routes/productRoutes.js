// src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Route to list all products
router.get('/', productController.listProducts);

// Route to get details of a specific product by ID
router.get('/:id', productController.getProductDetails);

// Route to create a new product (admin only)
router.post('/', adminMiddleware, productController.createProduct);

// Route to update an existing product (admin only)
router.put('/:id', adminMiddleware, productController.updateProduct);

// Route to delete a product (admin only)
router.delete('/:id', adminMiddleware, productController.deleteProduct);

module.exports = router;
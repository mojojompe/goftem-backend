const express = require("express");
const router = express.Router();

const {
  createAdmin,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getAllUsers,
  getUserById,
  deleteUser,
  trackOrder,
} = require("../controllers/adminController");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

// Debugging
console.log("createAdmin:", createAdmin);
console.log("adminMiddleware:", adminMiddleware);

// Admin routes for product management
router.post("/create", adminMiddleware, createAdmin);
router.post("/products", adminMiddleware, addProduct);
router.put("/products/:id", adminMiddleware, updateProduct);
router.delete("/products/:id", adminMiddleware, deleteProduct);
router.get("/products", adminMiddleware, getAllProducts);
router.get("/products/:id", adminMiddleware, getProductById);

// Admin routes for user management
router.get("/users", adminMiddleware, getAllUsers);
router.get("/users/:id", adminMiddleware, getUserById);
router.delete("/users/:id", adminMiddleware, deleteUser);

// Admin route for order tracking
router.get("/orders/:id", adminMiddleware, trackOrder);

module.exports = router;

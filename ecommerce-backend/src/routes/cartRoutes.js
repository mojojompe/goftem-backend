// src/routes/cartRoutes.js

const express = require("express");
const {
  addToCart,
  removeFromCart,
  viewCart,
} = require("../controllers/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to add an item to the cart
router.post("/add", authMiddleware, addToCart);

// Route to remove an item from the cart
router.delete("/remove/:productId", authMiddleware, removeFromCart);

// Route to view the cart
router.get("/", authMiddleware, viewCart);

module.exports = router;

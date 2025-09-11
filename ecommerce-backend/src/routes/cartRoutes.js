// src/routes/cartRoutes.js

const express = require("express");
const {
  addToCart,
  removeFromCart,
  viewCart,
} = require("../controllers/cartController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to add an item to the cart
router.post("/add", auth, addToCart);

// Route to remove an item from the cart
router.delete("/remove/:productId", auth, removeFromCart);

// Route to view the cart
router.get("/", auth, viewCart);

module.exports = router;

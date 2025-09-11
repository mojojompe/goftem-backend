// src/routes/orderRoutes.js

const express = require("express");
const {
  checkout,
  confirmPayment,
  myOrders,
} = require("../controllers/orderController");
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const router = express.Router();

// User routes
router.use(auth);
router.post("/checkout", checkout);
router.post("/confirm-payment", confirmPayment);
router.get("/my-orders", myOrders);

// Admin routes (example, uncomment and implement if needed)
// router.use(admin);
// router.get('/all', getAllOrders);
// router.put('/:orderId/status', updateOrderStatus);

module.exports = router;

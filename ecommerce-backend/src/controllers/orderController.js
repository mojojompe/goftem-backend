// src/controllers/orderController.js

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// Checkout (create order from cart)
exports.checkout = async (req, res) => {
  try {
    const Cart = require("../models/Cart");
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart empty" });
    let total = 0;
    for (const item of cart.items) {
      if (item.product.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `Not enough stock for ${item.product.name}` });
      total += item.product.price * item.quantity;
      item.product.stock -= item.quantity;
      await item.product.save();
    }
    const order = await Order.create({
      user: req.user._id,
      products: cart.items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
      })),
      total,
      status: "pending",
    });
    cart.items = [];
    await cart.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Confirm payment for an order
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.paymentConfirmed = true;
    order.status = "confirmed";
    await order.save();
    res.json({ message: "Payment confirmed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all orders for the logged-in user
exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

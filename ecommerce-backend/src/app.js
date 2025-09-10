require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Serve logo statically
app.use("/static", express.static(path.join(__dirname, "templates")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the app for testing purposes
module.exports = app;

const mongoose = require("mongoose");
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "your@email.com", // <-- EDIT THIS
    pass: process.env.SMTP_PASS || "yourpassword", // <-- EDIT THIS
  },
});

module.exports = transporter;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  otp: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  image: String,
});

module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  total: Number,
  status: { type: String, default: "pending" },
  paymentConfirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
};  expiresIn: "7d",
  });
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};nst verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
module.exports = { generateToken, verifyToken };



exports.generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = require('../config/mail');
const fs = require('fs');
const path = require('path');

const sendEmail = async (to, subject, templateName, variables) => {
  const templatePath = path.join(__dirname, '../templates', templateName);
  let html = fs.readFileSync(templatePath, 'utf8');

  Object.keys(variables).forEach((key) => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
  });

  await transporter.sendMail({
    from: '"Goftem Shop" <your@email.com>', // <-- EDIT THIS
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };

const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
};

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../services/emailService');
const { generateOtp } = require('../services/otpService');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const hashed = await bcrypt.hash(password, 10);
  const otp = generateOtp();
  const user = await User.create({ name, email, password: hashed, otp });
  await sendEmail(email, 'Welcome to Goftem!', 'welcomeEmail.html', {
    name,
    logoUrl: 'https://goftem-home.vercel.app/static/1.png', // <-- EDIT DOMAIN IF NEEDED
  });
  await sendEmail(email, 'Verify your email', 'otpEmail.html', {
    otp,
    logoUrl: 'https://goftem-home.vercel.app/static/1.png',
  });
  res.json({ message: 'Registered. Check your email for OTP.' });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
  user.isVerified = true;
  user.otp = null;
  await user.save();
  res.json({ message: 'Email verified' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Wrong password' });
  const token = generateToken(user);
  res.json({ token });
};

const Product = require('../models/Product');

exports.listProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.productDetails = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const item = cart.items.find(i => i.product.equals(productId));
  if (item) item.quantity += quantity;
  else cart.items.push({ product: productId, quantity });
  await cart.save();
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter(i => !i.product.equals(productId));
  await cart.save();
  res.json(cart);
};

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendEmail } = require('../services/emailService');

exports.checkout = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });
  let total = 0;
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) return res.status(400).json({ message: `Not enough stock for ${item.product.name}` });
    total += item.product.price * item.quantity;
    item.product.stock -= item.quantity;
    await item.product.save();
  }
  const order = await Order.create({
    user: req.user._id,
    products: cart.items.map(i => ({ product: i.product._id, quantity: i.quantity })),
    total,
    status: 'pending',
  });
  cart.items = [];
  await cart.save();
  await sendEmail(req.user.email, 'Order placed!', 'checkoutEmail.html', {
    name: req.user.name,
    orderId: order._id,
    total,
    logoUrl: 'https://goftem-home.vercel.app/static/1.png',
  });
  res.json(order);
};

exports.confirmPayment = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.paymentConfirmed = true;
  order.status = 'confirmed';
  await order.save();
  await sendEmail(order.user.email, 'Payment Confirmed!', 'paymentConfirmationEmail.html', {
    name: req.user.name,
    orderId: order._id,
    logoUrl: 'https://goftem-home.vercel.app/static/1.png',
  });
  res.json({ message: 'Payment confirmed' });
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('products.product');
  res.json(orders);
};

const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { sendEmail } = require('../services/emailService');

exports.addProduct = async (req, res) => {
  const { name, description, price, stock, image } = req.body;
  const product = await Product.create({ name, description, price, stock, image });
  // Notify all users about new stock
  const users = await User.find({ isVerified: true });
  for (const user of users) {
    await sendEmail(user.email, 'New Stock Added!', 'newStockEmail.html', {
      name: user.name,
      product: name,
      logoUrl: 'https://goftem-home.vercel.app/static/1.png',
    });
  }
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image } = req.body;
  const product = await Product.findByIdAndUpdate(id, { name, description, price, stock, image }, { new: true });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
};

exports.listUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.trackOrders = async (req, res) => {
  const orders = await Order.find().populate('user').populate('products.product');
  res.json(orders);
};

const router = require('express').Router();
const { register, verifyOtp, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

module.exports = router;
module.exports = router;router.get('/:id', productDetails);router.get('/', listProducts);const { listProducts, productDetails } = require('../controllers/productController');const router = require('express').Router();const router = require('express').Router();
const { register, verifyOtp, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

module.exports = router;




module.exports = router;router.post('/remove', removeFromCart);router.post('/add', addToCart);router.get('/', getCart);router.use(auth);const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');const auth = require('../middlewares/authMiddleware');const router = require('express').Router();const { register, verifyOtp, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

module.exports = router;















module.exports = router;router.get('/orders', trackOrders);router.get('/users', listUsers);router.delete('/products/:id', deleteProduct);router.put('/products/:id', updateProduct);router.post('/products', addProduct);router.use(auth, admin);const { addProduct, updateProduct, deleteProduct, listUsers, trackOrders } = require('../controllers/adminController');const admin = require('../middlewares/adminMiddleware');const auth = require('../middlewares/authMiddleware');const router = require('express').Router();module.exports = router;router.get('/my-orders', myOrders);router.post('/confirm-payment', confirmPayment);router.post('/checkout', checkout);router.use(auth);const { checkout, confirmPayment, myOrders } = require('../controllers/orderController');const auth = require('../middlewares/authMiddleware');const router = require('express').Router();


module.exports = router;router.post('/remove', removeFromCart);router.post('/add', addToCart);router.get('/', getCart);router.use(auth);const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');const auth = require('../middlewares/authMiddleware');const router = require('express').Router();const { register, verifyOtp, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

module.exports = router;

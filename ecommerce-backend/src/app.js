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

// Lightweight request logger for diagnostics
app.use((req, _res, next) => {
  try {
    console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  } catch (_) {}
  next();
});

// Serve logo statically
app.use("/static", express.static(path.join(__dirname, "templates")));

// Health endpoints for quick verification
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/api", (_req, res) => {
  res.status(200).json({ message: "GOFTEM API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Make sure authentication middleware runs before admin routes
const { authMiddleware } = require("./middlewares/authMiddleware");
app.use("/api/admin", authMiddleware, adminRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the app for testing purposes
module.exports = app;
console.log("MongoDB connected");

const express = require("express");
require("dotenv").config();
const app = express();
const db = require("./db/db");

app.use(express.json());
const productRoutes = require('./routes/product');

const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
// ================== task 1 =====================

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
// ================== task 2 =====================
app.use('/api', productRoutes);

// =================task 3=========================

app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

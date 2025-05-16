const express = require("express");
require("dotenv").config();
const app = express();
const db = require("./db/db");

app.use(express.json());
const productRoutes = require('./routes/productRoutes');

const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const userRoutes = require("./routes/userRoutes");
// ================== task 1 =====================

app.use("/api/users", userRoutes);

// ================== task 2 =====================
app.use('/api/products', productRoutes);

// =================task 3=========================

app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

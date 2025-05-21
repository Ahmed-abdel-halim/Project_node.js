const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { id: 1, role: "admin" };
  next();
});

// ================== task 1 user =====================

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
// ================== task 2 user =====================

const productRoutes = require("./routes/product");
app.use("/api", productRoutes);

// =================task 3 user =========================
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);

// ================== task 4 user =====================
const addressRoutes = require("./routes/addresses");
const shippingRoutes = require("./routes/shipping");
const paymentRoutes = require("./routes/payment");
app.use("/addresses", addressRoutes);
app.use("/shipping", shippingRoutes);
app.use("/payment", paymentRoutes);

// ================== task 5 user =====================

const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);
// ================== task 6 user =====================

const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api", reviewRoutes);
// ===================task 1 2 7 admin ========
const authRouters = require('./routes/authRouters');
const useradminRoutes = require('./routes/userRoutes');
const managerRoutes = require('./routes/managerRoutes');
const adminController =require("./routes/adminRoutes");
const contactController = require("./routes/contactRotes")


// check roles
// auth
app.use("/website/auth",authRouters);
// user
app.use("/website/role",useradminRoutes);
// mamnger
app.use("/website/manage", managerRoutes);
// admin route
app.use("/website/edit", adminController);
// contact route
app.use("/website/contact", contactController);




// check server
app.use((err, req, res, next) => {
	console.error('Error:', err.message);
	res.status(500).send(('Something Broken'));
});


// ================== task 3 admin =====================
const adminuserRoutes = require("./routes/adminUser.routes");
app.use("/admin/users", adminuserRoutes);

// ================== task 4 admin =====================
const productadminroute = require("./routes/adminProduct.routes");
app.use("/admin/products", productadminroute);
// ========================= 6 admin =============================

const orderRoute = require('./routes/orderRoutes');
app.use('/api/admin/orders', orderRoute);

// ================== run Server =========================
app.get('/', (req, res) => {
  res.send('API is running ');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





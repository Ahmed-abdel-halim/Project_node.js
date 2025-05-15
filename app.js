const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');

app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
require('dotenv').config();
const app = express();

const addressRoutes = require('./routes/addresses');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/orderRoutes');
const shippingRoutes = require('./routes/shipping');

app.use(express.json());
app.use('/api/addresses', addressRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shipping', shippingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

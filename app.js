const express = require('express');
const app = express();
const userRoutes = require('./routes/adminUser.routes');
const productRoutes = require('./routes/adminProduct.routes');

app.use(express.json());

// مثال على middleware مصادقة تجريبي (لا تستخدمه في الإنتاج)
app.use((req, res, next) => {
  req.user = { id: 1, role: 'admin' }; // مثال فقط، استبدله بـ JWT auth
  next();
});

// Routes
app.use('/admin/users', userRoutes);
app.use('/admin/products', productRoutes);

// تشغيل السيرفر
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running ✅');
});

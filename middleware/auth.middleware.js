function isAdmin(req, res, next) {
  // لازم تكون عامل مصادقة وتحط req.user مسبقًا
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager')) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}

module.exports = { isAdmin };

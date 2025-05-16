const Product = require('../models/productModel');

exports.getAllProducts = (req, res) => {
    const filters = {
        category_id: req.query.category_id,
        brand: req.query.brand,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice
    };

    Product.getFilteredProducts(filters, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err.message });
        }
        res.json(results);
    });
};

exports.getProductById = (req, res) => {
    const productId = req.params.id;

    Product.getProductById(productId, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json(results[0]);
    });
};

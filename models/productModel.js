const db = require('../db/db');

const Product = {
    getAllProducts: (callback) => {
        const query = 'SELECT * FROM products';
        db.query(query, callback);
    },

    getProductById: (id, callback) => {
        const query = 'SELECT * FROM products WHERE id = ?';
        db.query(query, [id], callback);
    },

    getFilteredProducts: (filters, callback) => {
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (filters.category_id) {
            query += ' AND category_id = ?';
            params.push(filters.category_id);
        }
        if (filters.brand) {
            query += ' AND brand = ?';
            params.push(filters.brand);
        }
        if (filters.minPrice) {
            query += ' AND price >= ?';
            params.push(filters.minPrice);
        }
        if (filters.maxPrice) {
            query += ' AND price <= ?';
            params.push(filters.maxPrice);
        }

        db.query(query, params, callback);
    }
};


module.exports = Product;

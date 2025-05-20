const db = require("../db/db");

exports.createShippingOption = (req, res) => {
  const { name, description, price, estimated_days } = req.body;
  const sql =
    "INSERT INTO shipping_options (name, description, price, estimated_days) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, description, price, estimated_days], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res
      .status(201)
      .json({ message: "Shipping option created", id: result.insertId });
  });
};

exports.getAllShippingOptions = (req, res) => {
  const sql = "SELECT * FROM shipping_options";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.updateShippingOption = (req, res) => {
  const { id } = req.params;
  const { name, description, price, estimated_days } = req.body;

  const sql =
    "UPDATE shipping_options SET name = ?, description = ?, price = ?, estimated_days = ? WHERE id = ?";

  db.query(sql, [name, description, price, estimated_days, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Shipping option updated" });
  });
};

exports.deleteShippingOption = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM shipping_options WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Shipping option deleted" });
  });
};

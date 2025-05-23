const db = require("../db/dbpayment");

exports.createAddress = (req, res) => {
  const userId = req.user.id;
  const {
    type,
    address_line_1,
    address_line_2,
    city,
    state,
    country,
    zip_code,
  } = req.body;

  const sql = `
    INSERT INTO addresses (user_id, type, address_line_1, address_line_2, city, state, country, zip_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      userId,
      type,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      zip_code,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: "Address added successfully", id: result.insertId });
    }
  );
};
exports.getAddressesByUser = (req, res) => {
  const userId = req.user.id;
  console.log("Getting addresses for user:", userId);

  const sql = "SELECT * FROM addresses WHERE user_id = userId";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.updateAddress = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const checkSql = "SELECT * FROM addresses WHERE id = ? AND user_id = ?";
  db.query(checkSql, [id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.status(403).json({ message: "Not authorized to update" });
    }

    const {
      type,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      zip_code,
    } = req.body;

    const updateSql = `
      UPDATE addresses SET type = ?, address_line_1 = ?, address_line_2 = ?, city = ?, state = ?, country = ?, zip_code = ?
      WHERE id = ?
    `;
    db.query(
      updateSql,
      [
        type,
        address_line_1,
        address_line_2,
        city,
        state,
        country,
        zip_code,
        id,
      ],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Address updated successfully" });
      }
    );
  });
};

exports.deleteAddress = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const checkSql = "SELECT * FROM addresses WHERE id = ? AND user_id = ?";
  db.query(checkSql, [id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    const deleteSql = "DELETE FROM addresses WHERE id = ?";
    db.query(deleteSql, [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Address deleted successfully" });
    });
  });
};

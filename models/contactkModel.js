const {pool} = require("../config/dbConnection")


class Contact{
     // Helper method for executing queries
      static async query(sql, params) {
        const [rows] = await pool.query(sql, params);
        return rows;
      }
    
      // Insertion --> Create feedback
    
      static async create({ user_id, user_email, message }) {
        // Create feedback
        const [result] = await pool.query(
          `INSERT INTO feedback (user_id, user_email, message) 
            VALUES (?, ?, ?)`,
            [user_id, user_email, message]
        );
          res.status(201).json({
        success: true,
        message: `feedback sent with email ${user_email}`,
        feddback: {
          user_id: newfed.id,
          user_email: newfed.email,
          message: newfed.message,
         
        }
      });
            return this.getById(result.insertId);
      }
      // get all
      static async getAll() {
          const query =await pool.query(
          `
        SELECT f.*, u.name AS user_name
        FROM feedback f
        JOIN users u ON f.user_id = u.id
      `
          );
            return query[0] || null;
      }
      // by id
      static async getById(id) {
        const [feddback] = await pool.query(`
        SELECT f.*, u.name,
        u.email
        FROM feedback f
        JOIN users u ON f.user_id = u.id
        WHERE f.id = ?`,id);
        return feddback[0] || null;
      }



// admin response
    static async addResponse(feedback_id, admin_id, message) {
     const [adminResponse] = await pool.query(
      `INSERT INTO feedback_responses
      (feedback_id, admin_id, message)
      VALUES (?, ?, ?)`,
      [feedback_id, admin_id, message]
    );
      return adminResponse[0] || null; 
}
     
              
      static async getUserFeedback(userId) {
        const [feedback] = await pool.query(`
          SELECT * FROM feedback 
          WHERE user_id = ?
          ORDER BY created_at DESC
        `, userId);
            return feedback [0];

      }
};

module.exports= Contact;
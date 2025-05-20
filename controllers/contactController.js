const Contact = require('../models/contactkModel');
const {pool} = require('../config/dbConnection');

// user feddback
const feedback = async (req, res) => {
  try {
    const { userEmail = "", message=""} = req.body || {};

    if (!userEmail || !message) {
      return res.status(400).json({
        success: false,
        message: 'user_email and message are required',
        missing_fields: {
        userEmail: !userEmail ? 'Missing' : 'Provided',
        message: !message ? 'Missing' : 'Provided',
        }
      });
    }
    const feedback = await feedback.create({ 
        UserId:req.user.id,
        userEmail, 
        message});
        res.status(201).json({
        success: true,
        message: 'Feedback sent successfully',
        feedback
        });
      } catch (err) {
        console.error('sent feedback error:', err);
        res.status(500).json({
          success: false,
          message: err.message ||'Failed to sent feedback'
        });
  }
};



const adminResponse = async (req, res) => {
  try {
        const { feedback_id = "", message=""} = req.body || {};
      
     if (!feedback_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'feedback id and responce are  required',
        missing_fields: {
        feedback_id: !feedback_id ? 'Missing' : 'Provided',
        message: !message ? 'Missing' : 'Provided',
        }
      });
    }
    const feedbackResponse = await feedbackResponse.create({ 
         feedback_id,admin_id, message});
        res.status(201).json({
        success: true,
        message: 'Feedback sent successfully',
        feedbackResponse
        });
      } catch (err) {
        console.error('sent feedback error:', err);
        res.status(500).json({
          success: false,
          message: err.message ||'Failed to sent feedback'
        });
  }
  };

module.exports = {
    feedback, adminResponse
}

const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const saltRounds = 10;

//  Middleware للتحقق من البيانات عند التسجيل
exports.registerValidator = [
  body("name")
    .notEmpty().withMessage("الاسم مطلوب")
    .isLength({ min: 2 }).withMessage("الاسم يجب أن يكون على الأقل حرفين"),

  body("email")
    .notEmpty().withMessage("البريد الإلكتروني مطلوب")
    .isEmail().withMessage("صيغة البريد الإلكتروني غير صحيحة"),

  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 6 }).withMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
];

// middleware للتحقق من البيانات عند تسجيل الدخول
exports.loginValidator = [
  body("email")
    .notEmpty().withMessage("البريد الإلكتروني مطلوب")
    .isEmail().withMessage("صيغة البريد الإلكتروني غير صحيحة"),

  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 6 }).withMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
];

// ✅ تسجيل مستخدم
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "البريد الإلكتروني مسجل مسبقًا" });
    }

    const password_hash = await bcrypt.hash(password, saltRounds);
    await db.execute("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [name, email, password_hash]);

    res.status(201).json({ message: "تم التسجيل بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "بيانات الدخول غير صحيحة" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: "بيانات الدخول غير صحيحة" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

// استرجاع بيانات لوحة المستخدم
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query("SELECT * FROM orders WHERE user_id = ?", [userId]);
    const [wishlist] = await db.query(
      `SELECT p.id, p.name, p.price, p.image_url 
       FROM wishlist w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ?`,
      [userId]
    );

    res.json({
      message: "بيانات لوحة تحكم المستخدم",
      orders,
      wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

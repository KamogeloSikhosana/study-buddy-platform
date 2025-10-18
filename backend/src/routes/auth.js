// src/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// =================== SIGNUP ===================
router.post("/signup", async (req, res) => {
  try {
    const { name, surname, email, password, address, bio, university, yos, course } = req.body;

    // Check if email already exists
    const [existing] = await db.query("SELECT * FROM Students WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert student
    const [result] = await db.query(
      `INSERT INTO Students (name, surname, email, address, bio, university, yos, course, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, surname, email, address || null, bio || null, university || null, yos || null, course || null, hashedPassword]
    );

    // Generate JWT
    const token = jwt.sign({ id: result.insertId, role: "student" }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User created",
      student_id: result.insertId,
      token
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =================== LOGIN ===================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt for:", email);

    // Check Students
    const [students] = await db.query("SELECT * FROM Students WHERE email = ?", [email]);
    if (students.length > 0) {
      const student = students[0];
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ 
        id: student.student_id, 
        name: `${student.name} ${student.surname}`,
        role: "student" 
      }, JWT_SECRET, { expiresIn: "7d" });

      console.log("✅ Login successful for student:", {
        id: student.student_id,
        name: `${student.name} ${student.surname}`,
        token: token.substring(0, 20) + "..." // Log partial token for debugging
      });

      return res.json({
        id: student.student_id,
        name: `${student.name} ${student.surname}`,
        role: "student",
        redirect: "/studentdashboard",
        message: "Login successful",
        token
      });
    }

    // Check Admins
    const [admins] = await db.query("SELECT * FROM Admins WHERE email = ?", [email]);
    if (admins.length > 0) {
      const admin = admins[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ 
        id: admin.admin_id, 
        name: "Admin",
        role: "admin" 
      }, JWT_SECRET, { expiresIn: "7d" });

      console.log("✅ Login successful for admin:", admin.admin_id);

      return res.json({
        id: admin.admin_id,
        name: "Admin",
        role: "admin",
        redirect: "/admindashboard",
        message: "Login successful",
        token
      });
    }

    // No user found
    console.log("❌ No user found with email:", email);
    res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Export the router as default
export default router;
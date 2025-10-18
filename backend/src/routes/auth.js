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

    if (!email || !password || !name || !surname) {
      return res.status(400).json({ error: "Name, surname, email, and password are required" });
    }

    // Check if email already exists
    const [existing] = await db.query("SELECT * FROM Students WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new student
    const [result] = await db.query(
      `INSERT INTO Students 
      (name, surname, email, address, bio, university, yos, course, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, surname, email, address || null, bio || null, university || null, yos || null, course || null, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, role: "student" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      student_id: result.insertId,
      token
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// =================== LOGIN ===================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("🔐 Login attempt:", email);

    // 1️⃣ Check if it's a Student
    const [students] = await db.query("SELECT * FROM Students WHERE email = ?", [email]);
    if (students.length > 0) {
      const student = students[0];
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        {
          id: student.student_id,
          name: `${student.name} ${student.surname}`,
          role: "student"
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        id: student.student_id,
        name: `${student.name} ${student.surname}`,
        role: "student",
        message: "Login successful",
        redirect: "/studentdashboard",
        token
      });
    }

    // 2️⃣ Check if it's an Admin
    const [admins] = await db.query("SELECT * FROM Admins WHERE email = ?", [email]);
    if (admins.length > 0) {
      const admin = admins[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin.admin_id, name: "Admin", role: "admin" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        id: admin.admin_id,
        name: "Admin",
        role: "admin",
        message: "Login successful",
        redirect: "/admindashboard",
        token
      });
    }

    // 3️⃣ No user found
    res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;

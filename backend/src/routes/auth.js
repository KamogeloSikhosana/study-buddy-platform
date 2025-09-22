// src/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    // Check if user already exists
    const [existing] = await db.query("SELECT * FROM Students WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert student
    const [result] = await db.query(
      "INSERT INTO Students (name, surname, email, password) VALUES (?, ?, ?, ?)",
      [name, surname, email, hashedPassword]
    );

    res.status(201).json({ message: "User created", student_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check Students table
    const [students] = await db.query("SELECT * FROM Students WHERE email = ?", [email]);
    if (students.length > 0) {
      const student = students[0];
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      return res.json({
        id: student.student_id,
        name: `${student.name} ${student.surname}`,
        role: "student"
      });
    }

    // Check Admins table
    const [admins] = await db.query("SELECT * FROM Admins WHERE email = ?", [email]);
    if (admins.length > 0) {
      const admin = admins[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      return res.json({
        id: admin.admin_id,
        name: "Admin",
        role: "admin"
      });
    }

    // No user found
    res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// Update profile route
router.put("/", authMiddleware, upload.single("profile_image"), async (req, res) => {
  try {
    const studentId = req.user.id;
    const { firstName, lastName, bio, university, course, yearOfStudy, address, email, currentPassword, newPassword } = req.body;

    // Update password if requested
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: "Current password required" });

      const [user] = await db.query("SELECT password FROM Students WHERE student_id = ?", [studentId]);
      if (!user.length) return res.status(404).json({ error: "User not found" });

      const isMatch = await bcrypt.compare(currentPassword, user[0].password);
      if (!isMatch) return res.status(400).json({ error: "Current password incorrect" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query("UPDATE Students SET password = ? WHERE student_id = ?", [hashedPassword, studentId]);
    }

    // Handle profile image
    const image = req.file ? req.file.filename : null;

    // Update profile fields
    await db.query(
      `UPDATE Students 
       SET name = ?, 
           surname = ?, 
           bio = ?, 
           university = ?, 
           course = ?, 
           yos = ?, 
           address = ?, 
           email = ?, 
           profile_image = COALESCE(?, profile_image) 
       WHERE student_id = ?`,
      [firstName, lastName, bio, university, course, yearOfStudy, address, email, image, studentId]
    );

    res.json({ message: "Profile updated successfully", profile_image: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";
import path from "path";
import fs from "fs";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// -----------------------------
// Ensure uploads folder exists
// -----------------------------
const uploadsDir = path.join(process.cwd(), "uploads", "profile_images");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// -----------------------------
// Multer config
// -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// -----------------------------
// Update student profile
// -----------------------------
router.put("/", authenticateToken, upload.single("profile_image"), async (req, res) => {
  try {
    const studentId = req.user.id; // student_id from JWT
    const {
      name,
      surname,
      bio,
      university,
      course,
      yos,
      address,
      email,
      currentPassword,
      newPassword,
    } = req.body;

    const updateData = {};

    // Only include fields that are explicitly provided
    const fields = { name, surname, bio, university, course, yos, address, email };
    Object.keys(fields).forEach(key => {
      if (fields[key] !== undefined && fields[key] !== null) {
        updateData[key] = fields[key];
      }
    });

    // Profile image
    if (req.file) updateData.profile_image = req.file.path;

    // Handle password update
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Current password required to change password" });
      }

      const student = await prisma.students.findUnique({ where: { student_id: studentId } });
      if (!student) return res.status(404).json({ success: false, message: "Student not found" });

      const isMatch = await bcrypt.compare(currentPassword, student.password);
      if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Update student in DB only with provided fields
    const updatedStudent = await prisma.students.update({
      where: { student_id: studentId },
      data: updateData,
    });

    res.json({ success: true, message: "Profile updated successfully", student: updatedStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

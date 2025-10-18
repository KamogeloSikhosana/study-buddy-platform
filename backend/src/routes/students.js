import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";
import path from "path";
import fs from "fs";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads", "profile_images");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get current student profile
router.get("/profile/me", authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("🔍 Fetching profile for student ID:", studentId);

    const student = await prisma.students.findUnique({
      where: { student_id: studentId },
      select: {
        student_id: true,
        name: true,
        surname: true,
        email: true,
        course: true,
        university: true,
        yos: true,
        bio: true,
        address: true,
        profile_image: true,
        created_at: true
      }
    });

    console.log("📊 Found student:", student);

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    // Format the response for frontend
    const studentData = {
      name: `${student.name} ${student.surname}`,
      email: student.email,
      course: student.course || "Not specified",
      year: student.yos ? `${student.yos} Year` : "Not specified",
      university: student.university || "Not specified",
      studentId: `UT${student.student_id}`,
      joinDate: new Date(student.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      status: "Active",
      image: student.profile_image,
      bio: student.bio,
      address: student.address
    };

    res.json({ 
      success: true, 
      data: studentData 
    });
  } catch (err) {
    console.error("❌ Error fetching student profile:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching profile" 
    });
  }
});

// Get student by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Fetching student by ID:", id);

    const student = await prisma.students.findUnique({
      where: { student_id: Number(id) },
      select: {
        student_id: true,
        name: true,
        surname: true,
        email: true,
        course: true,
        university: true,
        yos: true,
        bio: true,
        address: true,
        profile_image: true,
        created_at: true
      }
    });

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    // Format the response
    const studentData = {
      name: `${student.name} ${student.surname}`,
      email: student.email,
      course: student.course || "Not specified",
      year: student.yos ? `${student.yos} Year` : "Not specified",
      university: student.university || "Not specified",
      studentId: `UT${student.student_id}`,
      joinDate: new Date(student.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      status: "Active",
      image: student.profile_image,
      bio: student.bio,
      address: student.address
    };

    res.json({ 
      success: true, 
      data: studentData 
    });
  } catch (err) {
    console.error("❌ Error fetching student:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching student" 
    });
  }
});

export default router;
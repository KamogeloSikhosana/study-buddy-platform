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
// Get current student profile (using JWT token) - FIXED
// -----------------------------
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
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Format the response for frontend dashboard
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

// -----------------------------
// Get student by ID
// -----------------------------
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
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Format the response for frontend dashboard
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

// -----------------------------
// Update student profile
// -----------------------------
router.put("/", authenticateToken, upload.single("profile_image"), async (req, res) => {
  try {
    const studentId = req.user.id;
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

    console.log("🔄 Updating profile for student ID:", studentId);
    console.log("📦 Update data:", { name, surname, bio, university, course, yos, address, email });
    console.log("🖼️ File:", req.file);

    const updateData = {};

    // Only include fields that are explicitly provided
    const fields = { name, surname, bio, university, course, yos, address, email };
    Object.keys(fields).forEach(key => {
      if (fields[key] !== undefined && fields[key] !== null && fields[key] !== '') {
        updateData[key] = fields[key];
      }
    });

    // Profile image
    if (req.file) {
      updateData.profile_image = req.file.path;
      console.log("✅ Profile image updated:", req.file.path);
    }

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
      console.log("✅ Password updated");
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    // Update student in DB only with provided fields
    const updatedStudent = await prisma.students.update({
      where: { student_id: studentId },
      data: updateData,
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

    console.log("✅ Profile updated successfully");

    res.json({ 
      success: true, 
      message: "Profile updated successfully", 
      student: updatedStudent 
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating profile" 
    });
  }
});

// -----------------------------
// Get all students (with pagination and filtering)
// -----------------------------
router.get("/", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      university = "",
      course = "",
      sortBy = "created_at",
      sortOrder = "desc"
    } = req.query;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    const where = {
      AND: []
    };

    // Search filter (name, surname, email)
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { surname: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      });
    }

    // University filter
    if (university) {
      where.AND.push({
        university: { contains: university, mode: 'insensitive' }
      });
    }

    // Course filter
    if (course) {
      where.AND.push({
        course: { contains: course, mode: 'insensitive' }
      });
    }

    // Remove AND if no filters applied
    if (where.AND.length === 0) {
      delete where.AND;
    }

    // Get students with pagination and filtering
    const [students, totalCount] = await Promise.all([
      prisma.students.findMany({
        where,
        select: {
          student_id: true,
          name: true,
          surname: true,
          email: true,
          address: true,
          profile_image: true,
          bio: true,
          university: true,
          yos: true,
          course: true,
          created_at: true
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limitNum
      }),
      prisma.students.count({ where })
    ]);

    // Format the response
    const formattedStudents = students.map(student => ({
      id: student.student_id,
      name: `${student.name} ${student.surname}`,
      email: student.email,
      address: student.address || "Not specified",
      profileImage: student.profile_image || "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80",
      bio: student.bio || "No bio provided",
      university: student.university || "Not specified",
      yearOfStudy: student.yos || "Not specified",
      course: student.course || "Not specified",
      joinDate: new Date(student.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      studentId: `UT${student.student_id.toString().padStart(6, '0')}`,
      status: "Active"
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      data: formattedStudents,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      }
    });

  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching students" 
    });
  }
});

// -----------------------------
// Get student statistics (optional - useful for admin dashboard)
// -----------------------------
router.get("/stats/overview", authenticateToken, async (req, res) => {
  try {
    const totalStudents = await prisma.students.count();
    
    const studentsByUniversity = await prisma.students.groupBy({
      by: ['university'],
      _count: {
        student_id: true
      },
      where: {
        university: {
          not: null
        }
      }
    });

    const studentsByCourse = await prisma.students.groupBy({
      by: ['course'],
      _count: {
        student_id: true
      },
      where: {
        course: {
          not: null
        }
      }
    });

    const recentStudents = await prisma.students.count({
      where: {
        created_at: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        studentsByUniversity,
        studentsByCourse,
        recentStudents
      }
    });

  } catch (err) {
    console.error("❌ Error fetching student statistics:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching statistics" 
    });
  }
});

// -----------------------------
// Delete student (admin only - optional)
// -----------------------------
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting student ID:", id);

    // Check if student exists
    const student = await prisma.students.findUnique({
      where: { student_id: Number(id) }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Delete student
    await prisma.students.delete({
      where: { student_id: Number(id) }
    });

    console.log("✅ Student deleted successfully");

    res.json({ 
      success: true, 
      message: "Student deleted successfully" 
    });

  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while deleting student" 
    });
  }
});

// -----------------------------
// Serve profile images statically
// -----------------------------
router.use("/profile-images", express.static(uploadsDir));

export default router;
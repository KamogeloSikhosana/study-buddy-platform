import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../prismaClient.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Ensure upload folder exists
const uploadDir = path.join("uploads", "resources");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const allowedTypes = /pdf|docx|pptx|xlsx|csv/;

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error("Invalid file type. Only PDF, Word, Excel, PowerPoint, CSV allowed."));
  },
});

// ======================
// Upload Resource
// ======================
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    console.log("=== BACKEND UPLOAD DEBUG ===");
    console.log("📦 Request body:", req.body);
    console.log("👤 User object from JWT:", req.user);
    console.log("🔍 User object keys:", Object.keys(req.user));
    console.log("📁 File received:", req.file ? {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    } : 'NO FILE');

    const { description, session_id } = req.body;
    const file = req.file;

    if (!file) {
      console.log("❌ No file in request");
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Check what ID fields are available in the user object
    const availableIds = {
      id: req.user.id,
      student_id: req.user.student_id,
      user_id: req.user.user_id
    };
    console.log("🆔 Available ID fields:", availableIds);

    // Determine which ID to use
    let studentId;
    if (req.user.id) {
      studentId = req.user.id;
      console.log("✅ Using req.user.id:", studentId);
    } else if (req.user.student_id) {
      studentId = req.user.student_id;
      console.log("✅ Using req.user.student_id:", studentId);
    } else {
      console.log("❌ No valid student ID found in user object");
      return res.status(400).json({ 
        success: false, 
        message: "No valid student ID found in token" 
      });
    }

    console.log("💾 Creating resource in database...");
    
    const resource = await prisma.resource.create({
      data: {
        student_id: studentId,
        session_id: session_id ? Number(session_id) : null,
        file_name: file.originalname,
        file_path: file.path,
        file_type: path.extname(file.originalname).substring(1),
        description: description || `Uploaded ${new Date().toLocaleDateString()}`,
      },
    });

    console.log("✅ Resource created successfully:", resource);
    
    res.json({ 
      success: true, 
      message: "Resource uploaded successfully", 
      data: resource 
    });
    
  } catch (err) {
    console.error("❌ Upload error:", err);
    console.error("❌ Error stack:", err.stack);
    
    // More specific error handling
    if (err.code === 'P2003') { // Prisma foreign key constraint
      return res.status(400).json({ 
        success: false, 
        message: "Invalid student ID. User not found." 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// ======================
// List All Resources
// ======================
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        student: { select: { name: true, surname: true } },
        session: { select: { group_name: true, module_name: true } },
      },
      orderBy: { uploaded_at: "desc" },
    });
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================
// Download Resource
// ======================
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({ where: { resource_id: Number(id) } });
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    res.download(path.resolve(resource.file_path), resource.file_name);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================
// Delete Resource (Owner Only)
// ======================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("🗑️ DELETE DEBUG:");
    console.log("   Resource ID to delete:", id);
    console.log("   User making request:", req.user);
    console.log("   User ID from JWT:", req.user.id);

    const resource = await prisma.resource.findUnique({ 
      where: { resource_id: Number(id) } 
    });
    
    console.log("   Resource found:", resource);
    
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // Compare req.user.id with resource.student_id
    console.log("   Comparing - Resource student_id:", resource.student_id);
    console.log("   Comparing - User ID from JWT:", req.user.id);
    console.log("   Ownership match:", resource.student_id === req.user.id);

    if (resource.student_id !== req.user.id) {
      console.log("   ❌ Ownership mismatch - denying delete");
      return res.status(403).json({ 
        success: false, 
        message: "Forbidden: You can only delete your own resources",
        debug: {
          resourceOwnerId: resource.student_id,
          currentUserId: req.user.id,
          match: resource.student_id === req.user.id
        }
      });
    }

    console.log("   ✅ Ownership verified - proceeding with delete");

    // Delete file from server
    if (fs.existsSync(resource.file_path)) {
      fs.unlinkSync(resource.file_path);
      console.log("   File deleted from filesystem:", resource.file_path);
    } else {
      console.log("   ⚠️ File not found in filesystem:", resource.file_path);
    }

    // Delete from database
    await prisma.resource.delete({ where: { resource_id: Number(id) } });
    console.log("   ✅ Resource deleted from database");

    res.json({ 
      success: true, 
      message: "Resource deleted successfully" 
    });
    
  } catch (err) {
    console.error("❌ Delete error:", err);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// ======================
// Debug Ownership Check
// ======================
router.get("/debug-ownership/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("🔍 DEBUG OWNERSHIP CHECK:");
    console.log("   Requested resource ID:", id);
    console.log("   Current user from JWT:", req.user);

    const resource = await prisma.resource.findUnique({
      where: { resource_id: Number(id) },
      include: {
        student: { select: { student_id: true, name: true, surname: true } }
      }
    });

    if (!resource) {
      return res.json({ 
        success: false, 
        message: "Resource not found" 
      });
    }

    const ownershipMatch = resource.student_id === req.user.id;
    
    console.log("   Resource owner:", resource.student);
    console.log("   Current user ID:", req.user.id);
    console.log("   Ownership match:", ownershipMatch);

    return res.json({
      success: true,
      data: {
        resource: {
          id: resource.resource_id,
          student_id: resource.student_id,
          owner_name: resource.student ? `${resource.student.name} ${resource.student.surname}` : 'Unknown',
          file_name: resource.file_name
        },
        currentUser: {
          id: req.user.id,
          name: req.user.name
        },
        ownershipMatch: ownershipMatch,
        canDelete: ownershipMatch
      }
    });

  } catch (err) {
    console.error("❌ Debug ownership error:", err);
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

export default router;
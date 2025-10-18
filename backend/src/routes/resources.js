// src/routes/resources.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

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
router.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    const { description, session_id } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

    // Use req.user.id as the student_id
    const resource = await prisma.resource.create({
      data: {
        student_id: req.user.id, // <- fixed
        session_id: session_id ? Number(session_id) : null,
        file_name: file.originalname,
        file_path: file.path,
        file_type: path.extname(file.originalname).substring(1),
        description,
      },
    });

    res.json({ success: true, message: "Resource uploaded", data: resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================
// List All Resources
// ======================
router.get("/all", authenticateToken, async (req, res) => {
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
router.get("/download/:id", authenticateToken, async (req, res) => {
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
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({ where: { resource_id: Number(id) } });
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    if (resource.student_id !== req.user.student_id) {
      return res.status(403).json({ success: false, message: "Forbidden: You can only delete your own resources" });
    }

    // Delete file from server
    if (fs.existsSync(resource.file_path)) fs.unlinkSync(resource.file_path);

    // Delete from database
    await prisma.resource.delete({ where: { resource_id: Number(id) } });

    res.json({ success: true, message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

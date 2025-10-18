// src/routes/resources.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../prismaClient.js";
import { authMiddleware } from "../middleware/auth.js";


const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only PDF, Word, Excel, PowerPoint allowed."));
};

const upload = multer({ storage, fileFilter });

// Upload resource
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { description, session_id } = req.body;
    const resource = await prisma.resource.create({
      data: {
        student_id: req.user.student_id,
        session_id: session_id ? Number(session_id) : null,
        file_name: req.file.originalname,
        file_path: req.file.path,
        file_type: req.file.mimetype,
        description,
      },
    });
    res.json({ success: true, data: resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// List all resources
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        student: true,
        session: true,
      },
      orderBy: { uploaded_at: "desc" },
    });
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Download resource
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({ where: { resource_id: Number(id) } });
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    res.download(resource.file_path, resource.file_name);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete resource (optional, only owner can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({ where: { resource_id: Number(id) } });
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
    if (resource.student_id !== req.user.student_id)
      return res.status(403).json({ success: false, message: "Forbidden: You can only delete your own resources" });

    // delete file from server
    fs.unlinkSync(resource.file_path);

    // delete from DB
    await prisma.resource.delete({ where: { resource_id: Number(id) } });

    res.json({ success: true, message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

// src/routes/resources.js
import express from "express";
import pool from "../config/db.js"; // <-- use default import, matches your export
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// GET all resources
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM resources");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST upload a new resource
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { student_id, category } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = file.path; // stored path
    const fileName = file.originalname;

    await pool.query(
      "INSERT INTO resources (student_id, resource_name, file_path, uploaded_at) VALUES (?, ?, ?, NOW())",
      [student_id, fileName, filePath]
    );

    res.json({ message: "File uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

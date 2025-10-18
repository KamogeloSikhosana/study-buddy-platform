import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import db from "./config/db.js";
import authRoutes from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import studyGroupsRouter from "./routes/studyGroups.js";

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));

app.use(express.json());

// Serve uploaded images statically
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use("/uploads", express.static(uploadsDir));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Test route
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ test: rows[0].result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes
app.use("/api", authRoutes);
app.use("/api/profile", profileRouter);
app.use("/api/study-groups", studyGroupsRouter);

// Test route for study groups
app.get("/api/test-study-groups", (req, res) => {
  res.json({ message: "Study groups test route works!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
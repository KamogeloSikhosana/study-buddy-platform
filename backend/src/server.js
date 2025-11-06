import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Debug imports
console.log('🔍 Starting server imports...');

import db from "./config/db.js";
console.log('✅ Database imported');

import authRoutes from "./routes/auth.js";
console.log('✅ Auth routes imported');

import profileRouter from "./routes/profile.js";
console.log('✅ Profile routes imported');

import studentRoutes from "./routes/students.js";
console.log('✅ Student routes imported');

import resourceRoutes from "./routes/resources.js";
console.log('✅ Resource routes imported');

import studySessionsRouter from "./routes/studySessions.js";
console.log('✅ Study sessions routes imported');

import studyGroupsRouter from "./routes/studyGroups.js";
console.log('✅ Study groups routes imported');

import taskRoutes from "./routes/tasks.js";
console.log('✅ Task routes imported');

console.log('🎯 All imports successful!');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test database route
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ 
      test: rows[0].result,
      message: "Study Buddy Backend is running!",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Database test error:", err);
    res.status(500).json({ 
      error: err.message,
      message: "Database connection failed" 
    });
  }
});

// API Routes
app.use("/api", authRoutes);
app.use("/api/profile", profileRouter);
app.use("/api/students", studentRoutes);
app.use("/api/study-sessions", studySessionsRouter);
app.use("/api/study-groups", studyGroupsRouter);
app.use("/api/resources", resourceRoutes);
app.use("/api/tasks", taskRoutes);

// Simple 404 handler for all unmatched routes
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ 
      success: false,
      error: "API endpoint not found",
      path: req.originalUrl,
      message: "The requested API endpoint does not exist"
    });
  }
  
  res.status(404).json({ 
    success: false,
    error: "Route not found",
    path: req.url,
    message: "Please check the URL and try again"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).json({ 
    success: false,
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\n✨ =================================');
  console.log('🚀 Study Buddy Backend Server Started!');
  console.log('✨ =================================');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log('✅ All systems operational!');
  console.log('=================================\n');
});

export default app;
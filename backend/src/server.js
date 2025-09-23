import express from "express";
import cors from "cors";
import db from "./config/db.js";
import authRoutes from "./routes/auth.js"; // default import
import resourcesRouter from "./routes/resources.js";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ test: rows[0].result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Use auth routes
app.use("/api", authRoutes);

//resource route
// Serve uploaded files
app.use("/uploads", express.static(path.join("./uploads")));
app.use("/api/resources", resourcesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
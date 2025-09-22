import express from "express";
import cors from "cors";
import db from "./config/db.js";
import authRoutes from "./routes/auth.js"; // default import

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));